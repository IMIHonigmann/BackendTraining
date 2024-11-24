import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
    const supplier = await prisma.supplier.create({
        data: {
            name: 'SONY',
            description: 'A major electronics company'
        },
    });

    const category = await prisma.category.create({
        data: {
            name: 'Electronics',
            description: 'Electronic Products',
        },
    });

    const location = await prisma.location.create({
        data: {
            name: 'Warehouse 1',
        },
    });

    const product = await prisma.product.create({
        data: {
            name: 'Playstation 5',
            description: 'An overpriced piece of junk that is only created to waste time',
            price: 459.00,
            quantity: 238,
            category: {connect: {id: category.id}},
            supplier: {connect: {id: supplier.id}},
            location: {connect: {id: location.id}},
            status: true,
            releaseDate: new Date('2023-01-01'),
        },
    });

    console.log(product);
}

main()
    .catch(e => {
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });