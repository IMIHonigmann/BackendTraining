import express from 'express';
import { Request as Req } from 'express';
import { PrismaClient } from '@prisma/client';
import path from 'path';
import cors from 'cors';
// Add new imports
import { initializePassport } from './config/passport';
import { setAuthRoutes } from './routes/auth.routes';
import { authenticateJWT } from './middlewares/auth.middleware';
import { initRedis } from './redis';
import './types/editedTypes'
import { homeController } from './controllers/homeController';
import postRouter from './routes/postRouter';
import clubHouseRouter from './routes/clubhouseRouter';


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
    // app.use(authenticateJWT);

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
    app.get('/home', authenticateJWT, homeController)
    app.use('/posts', postRouter)
    app.use('/clubhouses', clubHouseRouter)

    return app;
}

export default init;

// TODO Validate the register/message posting input with express validator
// TODO (BONUS) implement passport-google-oauth2