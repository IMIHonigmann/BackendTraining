/////// app.js

import path from "node:path";
import { fileURLToPath } from "node:url";
import { PrismaClient } from '@prisma/client'
import express from "express"
import { Request, Response, NextFunction } from "express";
import session from "express-session";
import passport from "passport";
import {Strategy as LocalStrategy} from "passport-local";
import bcrypt from "bcryptjs"
const prisma = new PrismaClient()
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: "cats", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req: Request, res: Response) => res.render("index"));
app.get("/sign-up", (req: Request, res: Response) => res.render("sign-up-form"));

app.post("/sign-up", async (req: Request, res: Response, next: NextFunction) => {
    try {
        bcrypt.hash(req.body.password, 10, async (err: Error, hashedPassword: string) => {
            // if err, do something
            if(err) {

            }
            else  { // otherwise, store hashedPassword in DB
                await prisma.$queryRaw`INSERT INTO "Account" (name, password) VALUES (${req.body.username}, ${hashedPassword})` // leg das hashedPassword noch rein
            }
        });
        res.redirect("/");
    } catch(err) {
        return next(err);
    }

});

app.post(
    "/log-in",
    passport.authenticate("local", {
        successRedirect: "/homer",
        failureRedirect: "/"
    })
);

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});


app.get("/log-out", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect("/");
    });
});

app.listen(3000, () => console.log("app listening on port 3000!"));




passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const rows = await prisma.$queryRaw`SELECT * FROM "Account" WHERE name = ${username}`
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password)
            if (!user) {
                return done(null, false, { message: "Incorrect username" });
            }
            if (!match) {
                return done(null, false, { message: "Incorrect password" });
            }
            return done(null, user);
        } catch(err) {
            return done(err);
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const rows = await prisma.$queryRaw`SELECT * FROM "Account" WHERE id = ${id}`
        const user = rows[0];

        done(null, user);
    } catch(err) {
        done(err);
    }
});




