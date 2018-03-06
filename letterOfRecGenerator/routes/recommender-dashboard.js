var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var link = require('../models/link');
var credentials = require('../config/auth');
var googleAuth = require('google-auth-library');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

router.use(function (req, res, next) {
    res.locals.statusMessage = null;
    next();
});

router.get('/', function (req, res, next) {
    res.render('pages/recommender-dashboard', {
        title: 'Welcome ' + req.user.displayName + '!'
    });
});

router.post('/', function (req, res, next) {
    var gmailClass = google.gmail('v1');

    var email_lines = [];
    var toEmail = req.body.email;
    const hash = crypto.createHash('md5').update(toEmail).digest("hex");
    link.create({link: hash});

    if (!toEmail.length) {
        res.render('pages/recommender-dashboard', {
            title: 'RECOMMENDER DASHBOARD',
            statusMessage: 'Please provide a valid email'
        });
        return;
    }
    //email_lines.push('From: "test" <pcarion@gmail.com>');
    email_lines.push('To: ' + toEmail);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push('Subject: Invitation to Fill Recommendation Letter Questionairre');
    email_lines.push('');
    var url = encodeURI('http://localhost:3000/rec/' + hash);
    email_lines.push('<p>Please click the following questionairre <a href = "' + url + '">link.</a></p>');

    var email = email_lines.join('\r\n').trim();
    var base64EncodedEmail = new Buffer(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    var auth = new googleAuth();
    var oauth2Client = new OAuth2(credentials.clientId, credentials.clientSecret, credentials.clientCallback);
    oauth2Client.setCredentials(req.user.accessToken);

    gmailClass.users.messages.send({
      access_token: req.user.accessToken,
      userId: 'me',
      resource: {
        raw: base64EncodedEmail
      }
    });


    res.render('pages/recommender-dashboard', {
        title: 'RECOMMENDER DASHBOARD',
        statusMessage: 'Email invitation sent!',
        data: req.user.getActiveTemplates()
    });
});

module.exports = router;