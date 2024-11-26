import { PrismaClient } from '@prisma/client'
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




export default {
    ReadAll,
    FilterCategories
}