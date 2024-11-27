import {PrismaClient, quantityState} from '@prisma/client'
const prisma = new PrismaClient()

async function ReadAll(req, res) {
    const products = await prisma.product.findMany({})
    const categories = await prisma.category.findMany()

    console.log(categories)
    res.render('readAll', { products, categories })
}

let currentFilter: string[] = [];
async function FilterCategories(req, res) {
    const { filter, isChecked } = req.body
    ChangeFilter(filter, isChecked)
    const filterMatches = await prisma.product.findMany({
        where: {
            category: {
                name: {
                    in: currentFilter
                }
            }
        }
    });

    // set availability dynamically
    const lowSupplyThreshhold: number = 9
    for (const match of filterMatches) {
        const checkedAvailability: quantityState = (() => {
            switch(true) {
                case match.quantity >= lowSupplyThreshhold:
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

    res.json({ filterMatches });
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


        }
    })
}
// TODO: CreateProduct Form
// TODO: ChangeProductWithId Dynamic Router + Reassign Category Window
// TODO: DeleteAllProducts
// TODO: DeleteProductWithId
// TODO: DeleteCategory -> Make all product category fields that used that category null
// TODO: Add a category filter that displays all the products without a category
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
    DisplayProductWithId
}