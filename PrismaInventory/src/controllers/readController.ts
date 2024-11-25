import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function ReadAll(req, res) {
    const products = await prisma.product.findMany({

    })

    const categories = await prisma.category.findMany()

    console.log(categories)
    res.render('readAll', { products, categories })
}

export = {
    ReadAll
}