import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient();

export async function createPost(req, res) {
    const { title, content, clubhouseId } = req.body

    // fetch an arbitrary user for now
    const arbitraryUser = await prisma.user.findUnique({
        where: {
            email: req.user!.email
        }
    })
    // consider making clubhouse name unique to avoid too many database calls
    if (!arbitraryUser) {
        console.error(req.user!.email, 'does not exist in database')
        return
    }

    await prisma.post.create({
        data: {
            title: title,
            content: content,
            author: {
                connect: { id: arbitraryUser.id }
            },
            clubhouse: {
                connect: { id: parseInt(clubhouseId) }
            }
        }
    })

    console.log('Post successfully created')
}