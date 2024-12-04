import express from 'express';
import path from 'path';
import session from 'express-session';
import createError from 'http-errors';
import pg from 'pg'
import pgSession from 'connect-pg-simple'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// import indexRouter from './routes/index';
// import usersRouter from './routes/users';

const { Pool } = pg
const app = express();
const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:YeMTa3HSnsB8@ep-tight-cherry-a5agove4.us-east-2.aws.neon.tech/ExpressSessionStore?sslmode=require'
})
// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


const pgSessionStoreConnection = new (pgSession(session))({
  pool: pool,
  tableName: 'ExpressSessionStore'
})

// session setup
app.use(session({
  store: pgSessionStoreConnection,
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using https
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res, next) => {
  if(req.session.vueCount) {
    req.session.vueCount = req.session.vueCount +1
  }
  else {
    req.session.vueCount = 1
  }
  res.send(`<h1> I can see that you have viewed this page ${req.session.vueCount} times</h1>`)
})

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

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
  console.log(`Server is running on port 3000`)
})

export default app;