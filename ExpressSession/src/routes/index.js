import passport from 'passport';
import express from 'express';
import { genPassword } from '../lib/passwordUtils.js';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = express.Router();

router.get('/login-success', (req, res) => { res.send(`You're inside the mainframe yay`)})
router.get('/login-failure', (req, res) => { res.send(`Get the fuck out of here`)})

/* GET home page. */
router.get('/', (req, res, next) => {
  if (req.session.vueCount) {
    req.session.vueCount = req.session.vueCount + 1;
  } else {
    req.session.vueCount = 1;
  }
  res.send(`<h1> I can see that you have viewed this page ${req.session.vueCount} times</h1>`);
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('login');
});

/* GET register page. */
router.get('/register', function(req, res, next) {
  res.render('register');
});

/* POST login page. */
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    failureRedirect: '/login-failure',
    successRedirect: '/login-success' })(req, res, next)
});

/* POST register page. */
router.post('/register', async (req, res, next) => {
  const saltHash = genPassword(req.body.passwort);
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  await prisma.user.create({
    data: {
      username: req.body.benutzername,
      hash: hash,
      salt: salt,
    }
  });

  res.redirect('/login');
});

export default router;