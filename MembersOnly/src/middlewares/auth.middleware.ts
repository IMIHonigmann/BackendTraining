import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('jwt', { session: false }, (err: any, user: any) => {
        if (err || !user) {
            if (err.name === 'TokenExpired') {
                return res.status(401).json({ error: 'TokenExpired', message: 'Your session has expired. Please log in again.' })
            }
            if (err.name === 'InvalidToken') {
                return res.status(401).json({ error: 'InvalidToken', message: 'Invalid token' })
            }
            return res.status(401).json({ message: 'Unauthorized' });
        }
        req.user = user;
        next();
    })(req, res, next);
};