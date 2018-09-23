var express = require('express');
var app = express();
var router = express.Router();
var nodemailer = require('nodemailer');
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

/**
 * data needed to render recommender-dashboard
 */
router.get('/', function (req, res, next) {

    req.user.duplicateForms(function (err, forms) {
        console.log("duplicate Forms router!!!");

        // let numOrganizations = 0;
        // let formToDuplicate = null;
        for(let i=0; i<forms.length; i++) {
            console.log("FORM ***********************************");
            console.log(forms[i]);

            // if this form.duplicate == false
            if(!forms[i].duplicated) {

                let responses = forms[i].responses;
                for (let j = 0; j < responses.length; j++) {
                    let tag = responses[j].tag;
                    console.log(tag);
                    if (tag === '<!ORGANIZATION>') {
                        let organizationsList = responses[j].response.trim();
                        let organizationsArr = organizationsList.split(", ");
                        console.log("LENGTH OF ORGS");
                        console.log(organizationsArr.length);
                        let numOrganizations = organizationsArr.length;
                        let formToDuplicate = forms[i];

                        formToDuplicate.duplicated = true;
                        formToDuplicate.save();

                        for(let k=0; k<numOrganizations-1; k++) {
                            Form.duplicateForm(formToDuplicate, function (err, form) {
                                req.user.addForm(form, function (err) {
                                    if (err) {
                                        console.log(`error: ${err}`);
                                        return;
                                    }
                                });
                            });
                        }
                    }
                }
            }
        }

        // console.log("template");
        // console.log(formToDuplicate.template);
        // console.log("email");
        // console.log(formToDuplicate.email);
        //
        // let email = formToDuplicate.email;
        // let template = formToDuplicate.template;






    });

    req.user.getForms(function (err, forms) {
        console.log("get forms !!");
        console.log("my forms: ");
        //console.log(JSON.stringify(forms, null, 2));
        console.log("length: ");
        console.log(forms.length);
        if (err) {
            console.log(`error: ${err}`);
        } else {
            res.render('pages/recommender-dashboard', {
                title: 'Welcome ' + req.user.displayName + '!',
                templates: req.user.getTemplates(),
                forms: forms,
            });
        }
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



    Form.createForm(toEmail, req.user.getTemplate(req.body.templateId), function (err, form) {
        if (err) {
            console.log(`error: ${err}`);
        } else {
            req.user.addForm(form, function (err) {
                if (err) {
                    console.log(`error: ${err}`);
                    return;
                }
            });

            //email_lines.push('From: "test" <pcarion@gmail.com>');
            email_lines.push('To: ' + toEmail);
            email_lines.push('Content-type: text/html;charset=iso-8859-1');
            email_lines.push('MIME-Version: 1.0');
            email_lines.push('Subject: Invitation to Fill Recommendation Letter Questionairre');
            email_lines.push('');
            var url = encodeURI('http://localhost:3000/form-entry/' + form.getLink());
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
});

router.post('/delete', function (req, res, next) {
    var user = req.user;

    user.removeForm(req.body.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.user.getForms(function (err, forms) {
                if (err) {
                    console.log(`error: ${err}`);
                } else {
                    res.render('pages/recommender-dashboard', {
                        title: 'Welcome ' + req.user.displayName + '!',
                        templates: req.user.getTemplates(),
                        forms: forms,
                    });
                }
            });
        }
    });
});

module.exports = router;