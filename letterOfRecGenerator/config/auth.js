var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

var GOOGLE_CLIENT_ID = "480026254338-1eg6arrhf0b113brg1vdoc3ldtp5bsgk.apps.googleusercontent.com";
var GOOGLE_CLIENT_SECRET = "AUmL70GZSsowZujJCNb6AKCZ";
var GOOGLE_CALLBACK = 'http://localhost:3000/auth/google/callback';

var oauth2Client = new OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CALLBACK
);

module.exports = {
    clientId: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    clientCallback: GOOGLE_CALLBACK,
    oauth2Client
};