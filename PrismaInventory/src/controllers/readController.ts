import {PrismaClient, quantityState} from '@prisma/client'
const prisma = new PrismaClient()

async function ReadAll(req, res) {
    const products = await prisma.product.findMany({})
    const categories = await prisma.category.findMany()
    res.render('readAll', { products, categories })
}

let currentFilter: string[] = [];
async function FilterCategories(req, res) {
    const { filter, isChecked } = req.body
    ChangeFilter(filter, isChecked)

    let filterMatches = await prisma.product.findMany({
        where: {
            category: {
                name: {
                    in: currentFilter
                }
            }
        }
    });

    if(currentFilter.length == 0) {
       filterMatches = await prisma.product.findMany()
    }

    // set availability dynamically
    const lowSupplyThreshold: number = 9
    for (const match of filterMatches) {
        const checkedAvailability: quantityState = (() => {
            switch(true) {
                case match.quantity >= lowSupplyThreshold:
                    return "Available"
                case match.quantity >= 1:
                    return "Running_Low"
                default:
                    return "Out_Of_Stock"
            }
        })()

        await prisma.product.update({
            where: { id: match.id },
            data: { isAvailable: checkedAvailability }
        })
    }

    const categories = await prisma.category.findMany()
    res.json({ filterMatches, categories });
}

function ChangeFilter(filter, isChecked) {
    if(isChecked) {
        currentFilter.push(filter)
    }
    else {
        currentFilter = currentFilter.filter(e => e !== filter)
        console.log('Removed', filter)
    }
}

async function DisplayProductWithId(req, res) {
    const { productId } = req.params
    const filter: number = Number(productId)
    const matches = await prisma.product.findMany({
        where: {
            id: filter
        }
    })

    const results = matches[0].name
    res.json(results)
}

async function RenderCreateProduct(req, res) {
    const categories = await prisma.category.findMany()
    // TODO (ADVANCED): Should be automatically filled based on which user/company logs in
    const suppliers = await prisma.supplier.findMany()
    const locations = await prisma.location.findMany()
    res.render('createProduct', { categories, suppliers, locations })
}
async function CreateProduct(req, res) {
    const { newName, newDescription, newPrice, newReleaseDate, newLocation, newSupplier, newCategory } = req.body
    await prisma.product.create({
        data: {
            name: newName,
            description: newDescription,
            price: parseFloat(newPrice),
            releaseDate: new Date(newReleaseDate),
            location: {
                connect: { id: parseInt(newLocation) }
            },
            supplier: {
                connect: { id: parseInt(newSupplier) }
            },
            category: {
                connect: { id: parseInt(newCategory) }
            },
        }
    })

    res.redirect('/homer')
}

async function RenderChangeProduct(req, res) {
    const { productId } = req.params;

    const categories = await prisma.category.findMany()
    // TODO (ADVANCED): Should be automatically filled based on which user/company logs in
    const suppliers = await prisma.supplier.findMany()
    const locations = await prisma.location.findMany()
    const product = await prisma.product.findFirst({
        where: {
            id: parseInt(productId)
        }
    })
    res.render('changeProduct', { curProduct: product, categories, suppliers, locations })
}

async function ChangeProduct(req, res) {
    const { newName, newDescription, newPrice, newReleaseDate, newLocation, newSupplier, newCategory, productId } = req.body
    console.log( newName, newDescription, newPrice, newReleaseDate, newLocation, newSupplier, newCategory, productId )
    await prisma.product.update({
        where: { id: parseInt(productId) },
        data: {
            name: newName,
            description: newDescription,
            price: parseFloat(newPrice),
            location: {
                connect: { id: parseInt(newLocation) }
            },
            supplier: {
                connect: { id: parseInt(newSupplier) }
            },
            category: {
                connect: { id: parseInt(newCategory) }
            },
        }
    })

    res.redirect('homer')
}

async function DeleteAllProducts(req, res) {
    const allProducts = await prisma.product.findMany({})
    if(allProducts.length === 0) {
        await prisma.product.deleteMany({})
    }
    else {
        console.log('No products found')
    }
}

async function DeleteProductWithId(req, res) {
    const { productId } = req.params
    const elementToCheckIfExists = await prisma.product.findFirst({
        where: { id: parseInt(productId) }
    })
    if(elementToCheckIfExists) {
        await prisma.product.delete({
            where: { id: parseInt(productId) }
        })
    } else {
        console.log(`Entry ${productId} does not exist`)
    }
}

async function DeleteCategory(req, res) {
    const { categoryIdToDelete } = req.params
    const toDeleteCategoryId = parseInt(categoryIdToDelete)
    const category = await prisma.category.findUnique({
        where: {
            id: toDeleteCategoryId
        }
    })
    const uncategorized = await prisma.category.findFirst({
        where: {
            name: 'Uncategorized'
        }
    })
    if(category && toDeleteCategoryId !== uncategorized.id) {
        await prisma.product.updateMany({
            where: { categoryId: toDeleteCategoryId },
            data: {
                categoryId: uncategorized.id
            }
        })
        await prisma.category.delete({
            where: { id: toDeleteCategoryId }
        })
    } else {
        const message: string = `Category ${categoryIdToDelete} does not exist`
        res.send(message)
        console.log(message)
    }
}
// TODO: Make a price range filter


// TODO: Add a product name search/filter
// TODO: Use ExpressValidator for the name search

// STEP2: User Interaction
// TODO: Add a comment system (Title, Description, Star Rating)

// STEP3: Authentication
// TODO: (Read Auth Chapter, Make the Project then come back to make the CRUD Methods VIP Only)
// TODO: Add Likes, User Profile Tab with written Reviews


export default {
    ReadAll,
    FilterCategories,
    DisplayProductWithId,
    RenderCreateProduct,
    CreateProduct,
    RenderChangeProduct,
    ChangeProduct,
    DeleteAllProducts,
    DeleteProductWithId,
    DeleteCategory,
}