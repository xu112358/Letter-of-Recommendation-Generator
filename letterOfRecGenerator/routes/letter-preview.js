var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var nodemailer = require('nodemailer');
var credentials = require('../config/auth');
var googleAuth = require('google-auth-library');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;

router.get('/', function (req, res, next) {
    req.user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log(err);
        } else {
            res.render('pages/letter-preview', {
                title: 'Send a confirmation email for ' + form.email,
                templates: req.user.getEmailTemplates(),
                id: req.query.id,
            });
        }
    });
});

router.get('/form', function (req, res, next) {
    req.user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log(err);
        } else {
            res.json(form);
        }
    });
});

router.post('/addEmailHistory', function (req, res, next) {
    req.user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log("get form " + err);
        } else {
            Form.setEmailSent(req.body.id, function (err, form) {
                if (err) {
                    console.log(err);
                } else {
                    form.addEmailHistory_Form(req.body.Email, function (err, id) {
                        if (err) {
                            console.log("add email history " +err);
                        } else {
                            var email = form.email; // temp
                            var gmailClass = google.gmail('v1');
                            var email_lines = [];
                            var toEmail = email; // testing
                            var email_title = req.body.Email.subject;
                            var email_body = req.body.Email.body_text;
                        
                            email_lines.push('From: "test"');
                            email_lines.push('To: ' + toEmail);
                            email_lines.push('Content-type: text/html;charset=iso-8859-1');
                            email_lines.push('MIME-Version: 1.0');
                            email_lines.push('Subject: ' + email_title);
                            email_lines.push('');
                            email_lines.push(email_body);
                        
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
                    }
                ); 
                }
            });
        }
    });
});

module.exports = router;