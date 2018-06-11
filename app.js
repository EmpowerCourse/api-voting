var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser'); // reference our body parser component
var logger = require('morgan');
// this is the start of our MongoDB database connectivity, the next few lines tell our app where
// our database is, our security credentials and generally how to speak with it
var mongoose = require('mongoose');
var mongoDBPath = 'mongodb://db-user:QQwH5s8WLWJ0sCFp@empower-shard-00-00-nuc23.mongodb.net:27017,empower-shard-00-01-nuc23.mongodb.net:27017,empower-shard-00-02-nuc23.mongodb.net:27017/api_votes?ssl=true&replicaSet=empower-shard-0&authSource=admin&retryWrites=true';
dbOptions = {
    keepAlive: 1000,
    connectTimeoutMS: 30000,
    native_parser: true,
    auto_reconnect: false,
    poolSize: 10
  };
mongoose.connect(mongoDBPath, dbOptions);
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', (err) => {
	console.log(err);
});
db.once('open', (err) => {
	if (err) {
		console.log(err);
	} 
  // console.log('CONNECTED');
});

// this file contains the default page that will be sent back upon a request
var indexRouter = require('./routes/index');
// this was just an example route, we can comment it out
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
// we're going to comment out the default express processor and tell it to use our slightly better body parser instead
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', '*');
	res.setHeader('Access-Control-Max-Age', '1000');
});

app.use('/', indexRouter);
//app.use('/users', usersRouter);

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
