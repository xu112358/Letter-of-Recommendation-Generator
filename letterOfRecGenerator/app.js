var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// var cookieSession = require('cookie-session');
var session = require('express-session');
var index = require('./routes/index');
var login = require('./routes/login');
var recommenderDashboard = require('./routes/recommender-dashboard');
var templateDashboard = require('./routes/template-dashboard');
var users = require('./routes/users');
var {google} = require('googleapis');
var querystring = require('querystring');
var url = require('url');
var OAuth2 = google.auth.OAuth2;
var passport = require('./config/passport');

var expiryDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: 'anything',
    resave: true,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));

app.use(cookieParser());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

var GOOGLE_CLIENT_ID = "468934162681-cbfmk6ung8pm2jaqsf68r9e24vb888j5.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "5BktU-GsMF8nf-SFmQFD7vSJ";
var oauth2Client = new OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, "http://localhost:3000/auth/google/callback");

app.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

app.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: '/login'}), function (req, res) {
    // Successful authentication, redirect home.
    res.redirect('/recommender-dashboard')
});

app.use('/logout', (req, res) => {
    req.session.token = null;
    res.redirect('/login');
});

app.use('/', index);
app.use('/login', login);
app.use('/recommender-dashboard', isAuthenticated, recommenderDashboard);
app.use('/template-dashboard', isAuthenticated, templateDashboard)
app.use('/users', isAuthenticated, users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    console.log(err);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('pages/error');
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }

    res.redirect('/login');
}


module.exports = app;