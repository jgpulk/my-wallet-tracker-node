require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// DB Connection
var db = require('./services/db');

let Plan = require('./models/Plan');

// Routing diretories
var indexRouter = require('./routes/index');
var colorRouter = require('./routes/color');
var iconRouter = require('./routes/icon');
var userRouter = require('./routes/user');
var categoryRouter = require('./routes/category');
var walletRouter = require('./routes/wallet');
var adminRouter = require('./routes/admin/admin');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/', indexRouter);
app.use('/user', userRouter);
app.use('/user/category', categoryRouter);
app.use('/user/wallet', walletRouter);

// Common Routes
app.use('/color', colorRouter);
app.use('/icon', iconRouter);

// adminRoutes
app.use('/mwt/admin', adminRouter);

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
