import express from 'express';
import { Request as Req } from 'express';
import { PrismaClient, Tier } from '@prisma/client';
import argon2 from 'argon2';
import path from 'path';
import cors from 'cors';
// Add new imports
import { initializePassport } from './config/passport';
import { setAuthRoutes } from './routes/auth.routes';
import { authenticateJWT } from './middlewares/auth.middleware';

const prisma = new PrismaClient();
const app = express();

app.use(cors({
    origin: '*', // In production, replace with your specific domain
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Existing middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add new middleware
initializePassport();

// Add new routes
setAuthRoutes(app);
// Define your routes here
app.get('/', async (req, res) => {
    const matches = await prisma.user.findMany()
    res.send(matches);
});

app.get('/homeEndpoint', authenticateJWT, async (req, res, next) => {
    res.json({ MESAG: 'you made it tough motherfucker' })
})

app.get('/home', authenticateJWT,
    async (req, res) => {
        try {
            const signedInUser = await prisma.user.findUnique({
                where: { email: req.user.email }
            })

            const tiers = Object.values(Tier);
            const lvl = tiers.indexOf(signedInUser.membership)
            const allowedTiers = tiers.slice(0, lvl + 1);
            const posts = await prisma.post.findMany({
                include: {
                    author: {
                        select: {
                            name: true,
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
            // res.render('messages', { posts, Tier: Tier, level })
            res.json({ posts, Tier, level: lvl + 1 })


        } catch (error) {
            console.error('Posts could not be fetched', error)
            res.status(500).send('Error fetching posts')
        }
    })

app.get('/posts/addPost', authenticateJWT, async (req, res) => {
    res.render('sendMessage', {})
})

app.post('/posts/addPost', authenticateJWT, async (req, res) => {
    const { title, content } = req.body

    // fetch an arbitrary user for now
    const arbitraryUser = await prisma.user.findUnique({
        where: {
            email: req.user.email
        }
    })

    if (!arbitraryUser) {
        console.error(req.user.email, 'does not exist in database')
        return
    }

    await prisma.post.create({
        data: {
            title: title,
            content: content,
            author: {
                connect: { id: arbitraryUser.id }
            }
        }
    })

    console.log('Post successfully created')
})

app.get('/posts/delete/:postId', authenticateJWT,
    async (req, res) => {
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
                return res.status(404).json({ error: `Post with ID ${parsedId} not found` });
            }

            const deletor = await prisma.user.findUnique({
                where: { email: req.user.email }
            })
            if (!deletor.isAdmin && deletor.id !== post.authorId) {
                return res.status(409).json({ error: `You are not authorized to delete` })
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
    })

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// TODO Validate the register/message posting input with express validator
// TODO (BONUS) implement passport-google-oauth2