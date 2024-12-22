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
import jwt from 'jsonwebtoken';

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
    const { title, content, clubhouseId } = req.body

    // fetch an arbitrary user for now
    const arbitraryUser = await prisma.user.findUnique({
        where: {
            email: req.user.email
        }
    })

    // consider making clubhouse name unique to avoid too many database calls

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
            },
            clubhouse: {
                connect: { id: parseInt(clubhouseId) }
            }
        }
    })

    console.log('Post successfully created')
})

app.post('/clubhouses/createClubHouse', authenticateJWT, async (req, res) => {
    const { title, passcode } = req.body

    // fetch an arbitrary user for now
    const hashedPassword = await argon2.hash(passcode)

    await prisma.clubhouse.create({
        data: {
            title: title,
            passcode: hashedPassword
        }
    })

    res.status(200).send('Clubhouse successfully created')
    console.log('Clubhouse successfully created')
})

app.get('/clubhouses/:clubhouseId', authenticateJWT,
    async (req, res, next) => {
        const { clubhouseId } = req.params;

        const token = req.headers.authorization?.split(' ')[1]; // Remove 'Bearer '
        let decoded = jwt.decode(token);
        if (typeof decoded === 'string') {
            decoded = JSON.parse(decoded);
        } else {
            decoded = decoded;
        }

        const isClubhouseSignedInJWT = decoded.accessibleClubhouses.includes(parseInt(clubhouseId))
        if (isClubhouseSignedInJWT) {
            console.log('JWT successfully authenticated, redirecting...')
            return next();
        }

        console.log('JWT does not contain the clubhouse, checking redis...')
        // TODO: Add redis check here

        console.log('Redis does not contain the clubhouse, checking DB...')

        const existingAccess = await prisma.clubhouseUser.findUnique({
            where: {
                userId_clubhouseId: {
                    userId: req.user.id,
                    clubhouseId: parseInt(clubhouseId)
                }
            }
        })
        if (existingAccess) {
            console.log('DB lookup done, redirecting...');
            return next();
        }

        console.log(`User is not authorized to view this clubhouse, password will be checked...`)
        const { pagePW, rememberMe } = req.body;
        const clubHouse = await prisma.clubhouse.findUnique({
            where: {
                id: parseInt(clubhouseId)
            }
        })
        const requestedPassword = clubHouse.passcode;
        if (await argon2.verify(requestedPassword, pagePW)) {
            console.log('User entered the right password');
            if (rememberMe) {
                console.log('User will be remembered on next visit')
                await prisma.clubhouseUser.create({
                    data: {
                        userId: req.user.id,
                        clubhouseId: parseInt(clubhouseId)
                    }
                })
            }
            return next();
        } else {
            res.status(409).send('Incorrect Password')
            return;
        }

    },
    async (req, res) => {
        const { clubhouseId } = req.params;
        const clubHouse = await prisma.clubhouse.findUnique({
            where: { id: parseInt(clubhouseId) }
        })
        const posts = await prisma.post.findMany({
            where: { clubhouseId: parseInt(clubhouseId) }
        })

        res.status(200).json({ message: 'You made it cool guy', clubHouseName: clubHouse.title, posts })

    }
)

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

// TODO Hide username if logged in user is not an admin
// TODO Validate the register/message posting input with express validator
// TODO (BONUS) implement passport-google-oauth2