require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const User = require('./models/User');
const session = require('express-session');
const passport = require('passport');

mongoose.connect(`mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@clusterf.hrskngn.mongodb.net/express-figures?retryWrites=true&w=majority`)
.then(() => {
  console.log('Database connection successful.');
})
.catch((err) => {
  console.log('Database connection error.');
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var figuresRouter = require('./routes/figures');
var authRouter = require('./routes/auth');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(  {
  secret: 'my secret session',
  resave: false,
  saveUnititialized: false
}));
app.use(passport.authenticate('session'));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/figures', figuresRouter);
app.use('/', authRouter);



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

module.exports = app;
