var express = require('express');
var router = express.Router();
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var GOOGLE_CLIENT_ID = "///";
var GOOGLE_CLIENT_SECRET = "///";

var oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  "http://localhost:3000/auth/google/callback"
);

var scopes = [
  'https://www.googleapis.com/auth/plus.me'
];

var url = oauth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: scopes // If you only need one scope you can pass it as string
});

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('pages/login', {
        title: 'LETTER OF RECOMMENDATION GENERATOR',
        subtitle: 'Made with love by group 28.',
        url: url
    });
 

 
});

module.exports = router;