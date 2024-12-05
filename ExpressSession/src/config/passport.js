import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import { PrismaClient } from '@prisma/client'
import { validPassword } from "../lib/passwordUtils.js"

const prisma = new PrismaClient()

const customFields = {
    usernameField: 'benutzername',
    passwordField: 'passwort'
}

const verifyCallback = async (username, password, done) => {
    try {
        const user = await prisma.user.findUnique({
            where: { username: username }
        })
        if (!user) {
            return done(null, false, { message: 'Incorrect Username'})
        }

        const isValid = validPassword(password, user.hash, user.salt)

        if (isValid) {
            return done(null, user)
        } else {
            return done(null, false, { message: 'Incorrect password' })
        }
    } catch (err) {
        return done(err)
    }
}
const currentStrategy = new LocalStrategy(customFields, verifyCallback)
passport.use(currentStrategy)

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

