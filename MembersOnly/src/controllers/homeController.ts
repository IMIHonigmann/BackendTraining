import { PrismaClient, Tier } from "@prisma/client";
const prisma = new PrismaClient();

export async function homeController(req, res) {
    try {
        const signedInUser = await prisma.user.findUnique({
            where: { email: req.user!.email }
        })

        if (!signedInUser) {
            res.status(404).send(`User seems to have been deleted`)
            return;
        }

        const tiers = Object.values(Tier);
        // TODO: consider putting the membership inside the JWT for faster access
        const lvl = tiers.indexOf(signedInUser.membership)
        const allowedTiers = tiers.slice(0, lvl + 1);
        const posts = await prisma.post.findMany({
            include: {
                author: {
                    select: {
                        name: signedInUser.isAdmin,
                        membership: true
                    }
                }
            },
            where: {
                author: {
                    membership: {
                        in: allowedTiers
                    }
                }
            }
        })
        res.json({ posts, Tier, level: lvl + 1 })


    } catch (error) {
        console.error('Posts could not be fetched', error)
        res.status(500).send('Error fetching posts')
    }
}