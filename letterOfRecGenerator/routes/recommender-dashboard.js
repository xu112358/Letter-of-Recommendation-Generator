var express = require('express');
var app = express();
var router = express.Router();
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var Form = require('../models/form');
var Link = require('../models/link');
var credentials = require('../config/auth');
var googleAuth = require('google-auth-library');
var {google} = require('googleapis');
var OAuth2 = google.auth.OAuth2;

"use strict";

router.use(function (req, res, next) {
    res.locals.statusMessage = null;
    next();
});

router.get('/', function (req, res, next) {
    console.log(req.user);
    res.render('pages/recommender-dashboard', {
        title: 'Welcome ' + req.user.displayName + '!',
        templates: req.user.getActiveTemplates(),
        forms: req.user.getForms(),
    });
});

router.post('/', function (req, res, next) {
    var gmailClass = google.gmail('v1');
    var email_lines = [];
    var toEmail = req.body.email;

    if (!toEmail.length) {
        res.render('pages/recommender-dashboard', {
            title: 'RECOMMENDER DASHBOARD',
            statusMessage: 'Please provide a valid email'
        });
        return;
    }
    const hash = crypto.createHash('md5').update(toEmail).digest("hex");
    Link.create({link: hash}, function(error, link) {
        if (error) {
            console.log(`error: ${error}`);
        } else {
            var template = req.user.getTemplate(req.body.templateId);
            Form.create({ link, template, recommendee: toEmail, status: 'Sent', 'metadata.sentTimestamp': Date.now() }, function(err, form) {
                if (err) {
                    console.log(`error: ${err}`);
                } else {
                    req.user.addForm(form);
                    req.user.save();

                    //email_lines.push('From: "test" <pcarion@gmail.com>');
                    email_lines.push('To: ' + toEmail);
                    email_lines.push('Content-type: text/html;charset=iso-8859-1');
                    email_lines.push('MIME-Version: 1.0');
                    email_lines.push('Subject: Invitation to Fill Recommendation Letter Questionairre');
                    email_lines.push('');
                    var url = encodeURI('http://localhost:3000/form-entry/' + hash);
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

                    res.redirect('/recommender-dashboard');
                }
            });
        }
    });
});

module.exports = router;