var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session      = require('express-session');
var index = require('./routes/index');
var login = require('./routes/login');
var recommenderDashboard = require('./routes/recommender-dashboard');
var templateDashboard = require('./routes/template-dashboard');
var users = require('./routes/users');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;


var app = express();

app.use(session({ secret: 'd' }));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/login', login);
app.use('/recommender-dashboard', recommenderDashboard);
app.use('/template-dashboard', templateDashboard)
app.use('/users', users);


var GOOGLE_CLIENT_ID = "///";
var GOOGLE_CLIENT_SECRET = "///";
var oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);
app.use("/auth/google/callback", function (req, res) {
  const qs = querystring.parse(url.parse(req.url).query);
  oAuth2Client.getToken(qs.code, (err, tokens) => {
    if (err) {
      return callback(err);
    }
    oAuth2Client.credentials = tokens;
  });
  req.session.tokens = oAuth2Client.credentials;
  return res.redirect('/recommender-dashboard');
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
