import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
    const supplier1 = await prisma.supplier.create({
        data: {
            name: 'SONY',
            description: 'A major electronics company'
        },
    });

    const supplier2 = await prisma.supplier.create({
        data: {
            name: 'Samsung',
            description: 'A leading technology company'
        },
    });

    const supplier3 = await prisma.supplier.create({
        data: {
            name: 'Apple',
            description: 'A premium electronics manufacturer'
        },
    });

    const category1 = await prisma.category.create({
        data: {
            name: 'Electronics',
            description: 'Electronic Products',
        },
    });

    const category2 = await prisma.category.create({
        data: {
            name: 'Home Appliances',
            description: 'Appliances for home use',
        },
    });

    const category3 = await prisma.category.create({
        data: {
            name: 'Computers',
            description: 'Computer and accessories',
        },
    });

    const location1 = await prisma.location.create({
        data: {
            name: 'Warehouse 1',
        },
    });

    const location2 = await prisma.location.create({
        data: {
            name: 'Warehouse 2',
        },
    });

    const location3 = await prisma.location.create({
        data: {
            name: 'Warehouse 3',
        },
    });

    const product1 = await prisma.product.create({
        data: {
            name: 'Playstation 5',
            description: 'A gaming console',
            price: 459.00,
            quantity: 238,
            category: {connect: {id: category1.id}},
            supplier: {connect: {id: supplier1.id}},
            location: {connect: {id: location1.id}},
            status: true,
            releaseDate: new Date('2023-01-01'),
        },
    });

    const product2 = await prisma.product.create({
        data: {
            name: 'Galaxy S21',
            description: 'A smartphone',
            price: 799.00,
            quantity: 150,
            category: {connect: {id: category1.id}},
            supplier: {connect: {id: supplier2.id}},
            location: {connect: {id: location2.id}},
            status: true,
            releaseDate: new Date('2023-02-01'),
        },
    });

    const product3 = await prisma.product.create({
        data: {
            name: 'MacBook Pro',
            description: 'A laptop',
            price: 1299.00,
            quantity: 100,
            category: {connect: {id: category3.id}},
            supplier: {connect: {id: supplier3.id}},
            location: {connect: {id: location3.id}},
            status: true,
            releaseDate: new Date('2023-03-01'),
        },
    });

    console.log(product1, product2, product3);

}

main()
    .catch(e => {
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });