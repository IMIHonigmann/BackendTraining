import passport from "passport";
import express from "express";
import { genPasswordSafe } from "../lib/passwordUtils.js";
import { PrismaClient } from "@prisma/client";
import { checkAuthentication } from "../middleware/authenticator.js";

const prisma = new PrismaClient();
const router = express.Router();

router.get("/login-success", checkAuthentication, (req, res) => {
  res.send(`You're inside the mainframe yay`);
});
router.get("/login-failure", (req, res) => {
  res.send(`Get the fuck out of here`);
});

/* GET home page. */
router.get("/", checkAuthentication, (req, res, next) => {
  if (req.session.vueCount) {
    req.session.vueCount = req.session.vueCount + 1;
  } else {
    req.session.vueCount = 1;
  }
  res.send(
    `<h1> I can see that you have viewed this page ${req.session.vueCount} times</h1>`
  );
});

/* GET login page. */
router.get("/login", (req, res, next) => {
  res.render("login", { user: req.user });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.send("You have been logged out! Have a nice day");
});

/* GET register page. */
router.get("/register", function (req, res, next) {
  res.render("register");
});

/* POST login page. */
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    failureRedirect: "/login-failure",
    successRedirect: "/login-success",
  })(req, res, next);
});

/* POST register page. */
router.post("/register", async (req, res, next) => {
  const encryptedPassword = await genPasswordSafe(req.body.passwort);

  await prisma.user.create({
    data: {
      username: req.body.benutzername,
      salt: encryptedPassword.salt.toString(),
      hash: encryptedPassword.hashedPassword,
    },
  });

  res.redirect("/login");
});

export default router;
