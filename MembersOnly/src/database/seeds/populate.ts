import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();

async function main() {
    const user1 = await prisma.user.create({
        data: {
            name: 'Sigma Chad',
            email: 'sigma@based.com',
            password: 'hashedPassword123', // In production, use proper hashing
            membership: 'sigma'
        },
    });

    const user2 = await prisma.user.create({
        data: {
            name: 'Based Individual',
            email: 'based@based.com',
            password: 'hashedPassword456',
            membership: 'based'
        },
    });

    const user3 = await prisma.user.create({
        data: {
            name: 'Average NPC',
            email: 'npc@gmail.com',
            password: 'hashedPassword789',
            membership: 'npc'
        },
    });

    const post1 = await prisma.post.create({
        data: {
            title: 'Why Sigma Grindset Matters',
            content: 'Stay on that grind kings 👑',
            published: true,
            author: { connect: { id: user1.id } }
        },
    });

    const post2 = await prisma.post.create({
        data: {
            title: 'Based Department Calling',
            content: 'Hello? Based Department?',
            published: true,
            author: { connect: { id: user2.id } }
        },
    });

    const post3 = await prisma.post.create({
        data: {
            title: 'My First Post',
            content: 'Hello World!',
            published: false,
            author: { connect: { id: user3.id } }
        },
    });

    console.log({ users: [user1, user2, user3], posts: [post1, post2, post3] });
}

main()
    .catch(e => {
        console.error(e.message);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });