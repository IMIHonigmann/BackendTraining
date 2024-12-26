import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function deletePost(req, res): Promise<void> {
    const parsedId = parseInt(req.params.postId)
    if (isNaN(parsedId)) {
        res.send(`${req.params.postId} is not a number`)
        return;
    }
    try {
        const post = await prisma.post.findUnique({
            where: {
                id: parsedId
            }
        });

        if (!post) {
            res.status(404).json({ error: `Post with ID ${parsedId} not found` });
            return
        }

        const deletor = await prisma.user.findUnique({
            where: { email: req.user!.email }
        })
        if (!deletor) {
            res.status(404).json({ error: `User does not exist perhaps he was deleted while he still having a valid JWT` });
            return
        }
        if (!deletor.isAdmin && deletor.id !== post.authorId) {
            res.status(409).json({ error: `You are not authorized to delete` })
            return
        }

        await prisma.post.delete({
            where: {
                id: parsedId
            }
        });

        res.status(200).json({ message: 'Post deleted successfully' });

    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Internal server error while deleting post' });
    }
}