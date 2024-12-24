import express from 'express';
import { Request as Req } from 'express';
import { Clubhouse, PrismaClient, Tier } from '@prisma/client';
import argon2 from 'argon2';
import path from 'path';
import cors from 'cors';
// Add new imports
import { initializePassport } from './config/passport';
import { setAuthRoutes } from './routes/auth.routes';
import { authenticateJWT } from './middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { initRedis, redisClient } from './redis';
import './types/editedTypes'


const init = async () => {
    await initRedis();
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
                    where: { email: req.user!.email }
                })

                if (!signedInUser) {
                    res.status(404).send(`User seems to have been deleted`)
                    return;
                }

                const tiers = Object.values(Tier);
                // TODO: consider putting the membership and isAdmin inside the JWT for faster access
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
        })

    app.get('/posts/addPost', authenticateJWT, async (req, res) => {
        res.render('sendMessage', {})
    })

    app.post('/posts/addPost', authenticateJWT, async (req, res) => {
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

            const token = req.headers.authorization!.split(' ')[1]; // Remove 'Bearer '
            const decoded = jwt.decode(token) as JWTPL;

            // TODO: Sort the accessibleClubhouses on logging in inside the jwt
            // and then use binary search to find it here



            const isClubhouseSignedInJWT = decoded!.accessibleClubhouses.includes(parseInt(clubhouseId))
            if (isClubhouseSignedInJWT) {
                console.log('JWT successfully authenticated, redirecting...')
                return next();
            }

            console.log('JWT does not contain the clubhouse, checking redis...')
            const clubHouseUsers = await redisClient.get(`clubhouse:${clubhouseId}`)
            if (clubHouseUsers) {
                const clubHouseUsersArray = JSON.parse(clubHouseUsers)
                if (clubHouseUsersArray.includes(req.user!.id)) {
                    console.log('Cache Hit: redirecting...')
                    return next();
                }
            }

            console.log('Cache Miss: Redis does not contain the user in the clubhouse, checking DB...')

            const existingAccess = await prisma.clubhouseUser.findUnique({
                where: {
                    userId_clubhouseId: {
                        userId: req.user!.id,
                        clubhouseId: parseInt(clubhouseId)
                    }
                }
            })
            if (existingAccess) {
                console.log('DB lookup done, redirecting...');

                const allowedUsers = await redisClient.get(`clubhouse:${clubhouseId}`)
                let allowedUsersArray: number[] = []

                try {
                    allowedUsersArray = allowedUsers ? JSON.parse(allowedUsers) : []

                    console.log(allowedUsersArray)
                    if (!allowedUsersArray.includes(req.user!.id)) {
                        allowedUsersArray.push(req.user!.id)
                        await redisClient.setEx(
                            `clubhouse:${clubhouseId}`,
                            3600,
                            JSON.stringify(allowedUsersArray)
                        )
                    }
                } catch (error) {
                    console.error('Error processing users:', error)
                }

                return next();
            }

            console.log(`User is not authorized to view this clubhouse, password will be checked...`)
            const { pagePW, rememberMe } = req.body;
            const clubHouse = await prisma.clubhouse.findUnique({
                where: { id: parseInt(clubhouseId) }
            })

            if (!clubHouse) {
                res.status(404).send('Clubhouse does not exist')
                return
            }
            res.locals.clubHouse = clubHouse;
            let requestedPassword = clubHouse.passcode;
            if (!requestedPassword) {
                requestedPassword = ""
            }
            if (await argon2.verify(requestedPassword, pagePW)) {
                console.log('User entered the right password');
                if (rememberMe) {
                    console.log('User will be remembered on next visit')
                    await prisma.clubhouseUser.create({
                        data: {
                            userId: req.user!.id,
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
            const posts = await prisma.post.findMany({
                where: { clubhouseId: parseInt(clubhouseId) }
            })

            // TODO: This seems stupid because it means that no matter what we do a database call is always required, which nullifies the speed advantage of the other authentication methods
            // At this point this means that the password check is the fastest because it only does the database call while the others do their operation + an additional database call
            // consider caching this query at least
            const clubHouse: Pick<Clubhouse, 'title'> | null = res.locals.clubHouse ?? await prisma.clubhouse.findUnique({
                where: { id: parseInt(clubhouseId) },
                select: { title: true }
            })

            if (!clubHouse) {
                res.status(404).send('Clubhouse does not exist')
                return
            }

            res.status(200).json({
                message: 'You made it cool guy',
                clubHouseName: clubHouse.title ?? "Nameless Clubhouse",
                posts
            })

        }
    )

    app.get('/posts/delete/:postId', authenticateJWT,
        async (req, res): Promise<void> => {
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
        })

    return app;
}


// Start the server
const PORT = process.env.PORT || 3000;
init().then(app => {
    app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))
});

// TODO Validate the register/message posting input with express validator
// TODO (BONUS) implement passport-google-oauth2