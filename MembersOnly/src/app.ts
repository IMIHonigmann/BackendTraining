import express from 'express';
import { Request as Req, Response as Res } from 'express'
import { PrismaClient, Tier } from '@prisma/client';
import argon2 from 'argon2'
import path from 'path';
const prisma = new PrismaClient()
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your routes here
app.get('/', async (req, res) => {
    const matches = await prisma.user.findMany()
    res.send(matches);
});

app.get('/users/login', async (req, res) => {
    res.render('login', {})
})

app.get('/users/register', async (req, res) => {
    res.render('register', {})
})

app.get('/home',
    async (req, res) => {
        try {
            const level = 1
            const tiers = Object.values(Tier);
            const allowedTiers = tiers.slice(0, level + 1);
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
            res.render('messages', { posts, Tier: Tier, level })

        } catch (error) {
            console.error('Posts could not be fetched', error)
            res.status(500).send('Error fetching posts')
        }
    })

app.post('/users/login', async (req, res) => {
    try {
        const { email, password } = req.body
        const match = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!match) {
            res.status(404).send(`${email}: User has not been found`)
            return
        }
        if (await argon2.verify(match.password, password)) {
            res.status(200).send('Authentication successful')
        } else {
            res.status(401).send('Wrong Password')
        }
    } catch (err) {
        console.error(err)
    }
})

interface RegisterRequestBody {
    username: string;
    email: string;
    password: string;
}

app.post('/users/register', async (req: Req<{}, {}, RegisterRequestBody>, res) => {
    try {
        const { username, email, password } = req.body;
        const hash = await argon2.hash(password);
        await prisma.user.create({
            data: {
                name: username,
                password: hash,
                email: email
            }
        });
    } catch (err) {
        console.error(err);
    }

    res.redirect('/users/login');
});

app.get('/posts/addPost', async (req, res) => {
    res.render('sendMessage', {})
})

app.post('/posts/addPost', async (req, res) => {
    const { title, content } = req.body

    // fetch an arbitrary user for now
    const arbitraryEmail = 'ddd'
    const arbitraryUser = await prisma.user.findUnique({
        where: {
            email: arbitraryEmail
        }
    })

    if (!arbitraryUser) {
        console.error(arbitraryEmail, 'does not exist in database')
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

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// TODO implement passport-local strategy
// TODO if login works: protect the posting route and rewrite the filter dependency to use passport
// TODO Add an admin field that displays delete buttons
// TODO Create the Delete routes for the admin
// TODO Validate the register/message posting input with express validator
// TODO (BONUS) implement passport-google-oauth2