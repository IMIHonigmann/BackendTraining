import path from 'path';
import express from 'express';
import session from 'express-session';
import createError from 'http-errors';
import pgSession from 'connect-pg-simple';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PrismaClient } from '@prisma/client';
import pool from './config/database.js';
import passport from 'passport';
import indexRouter from './routes/index.js';
import 'dotenv/config';
import './config/passport.js';  

const app = express();
const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const pgSessionStoreConnection = new (pgSession(session))({
  pool: pool,
  tableName: 'ExpressSessionStore'
});

// session setup
app.use(session({
  store: pgSessionStoreConnection,
  secret: process.env.SESSION_SECRET || 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));


// -------- ROUTES -----------
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});

export default app;