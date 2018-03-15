var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var Hashids = require('hashids');
global.hashids = new Hashids('alchemist');

var index = require('./routes/index');
var view = require('./routes/view');

var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost');

var mongoose_db = mongoose.connection;
mongoose_db.on('error', console.error);
mongoose_db.once('open', function() {
    console.log("Connected to mongd server");
});

global.db = require('./db/schema.js');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// use express-session
app.use(session({
  secret: 'sakuraForWhom',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 6
  }
}));

// mobile checker -> req.is_mobile = true | false
app.use(function(req, res, next) {
    var user_agent = req.headers['user-agent'];
    req.is_mobile = /mobile/i.test(user_agent) || /android/i.test(user_agent);
    req.is_mobile_safari = /mobile/i.test(user_agent) && /Safari/i.test(user_agent);
    next();
});

app.use('/', index);
app.use('/', view);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
 app.listen(80);
module.exports = app;
