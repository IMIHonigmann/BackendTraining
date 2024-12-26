import { Router, Application } from 'express';
import AuthController from '../controllers/auth.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import passport from 'passport'

const router = Router();
const authController = new AuthController();

export function setAuthRoutes(app: Application) {
    app.get('/users/login', async (req, res) => {
        res.render('login', {})
    })

    app.get('/users/register', async (req, res) => {
        res.render('register', {})
    })

    // @ts-ignore
    app.post('/users/register', authController.register.bind(authController));
    // @ts-ignore
    app.post('/users/login', authController.login.bind(authController));

    // Protected route
    app.get('/users/user/profile', authenticateJWT, (req, res) => {
        // @ts-ignore
        res.json({ message: 'Protected route accessed successfully', user: req.user });
    });
}

export default router;