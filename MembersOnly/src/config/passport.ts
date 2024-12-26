import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import User from '../models/user.model';

export const initializePassport = () => {
    passport.use(new LocalStrategy(
        async (username, password, done) => {
            try {
                const user = await User.findByEmail(username);
                if (!user || !(await user.validatePassword(password))) {
                    return done(null, false, { message: 'Invalid credentials' });
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.use(new JwtStrategy({
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET || 'default_jwt_secret',
    }, async (jwtPayload, done) => {
        try {
            const user = await User.findById(jwtPayload.id);
            console.log(user)
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        // @ts-ignore
        done(null, user.id);
    });

    passport.deserializeUser(async (id: number, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error);
        }
    });
};