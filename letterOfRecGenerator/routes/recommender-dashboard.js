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
const fs = require('fs');
var Docxtemplater = require('docxtemplater');
var DocxMerger = require('docx-merger');
var Readable = require('stream').Readable;
var path = require('path');
var builder = require('docx-builder')
var docx = new builder.Document();
var dt = require('./letter-parser')

"use strict";

router.use(function (req, res, next) {
    res.locals.statusMessage = null;
    next();
});

/**
 * data needed to render recommender-dashboard
 */
router.get('/', function (req, res, next) {
    req.user.getForms(function (err, forms) {
        if (err) {
            console.log(`error: ${err}`);
        } else {
            res.render('pages/recommender-dashboard', {
                title: req.user.displayName,
                templates: req.user.getTemplates(),
                forms: forms,
                subject: req.user.getLinkTemplateSubject(),
                body: req.user.getLinkTemplateBody()
            });
        }
    }); 
});

router.post('/', function (req, res, next) {
    var gmailClass = google.gmail('v1');
    var email_lines = [];
    var toEmail = req.body.email;
    var subject = req.body.subject_text;
    var body = req.body.body_text;
   
    if (!toEmail.length) {
        res.render('pages/recommender-dashboard', {
            title: 'RECOMMENDER DASHBOARD',
            statusMessage: 'Please provide a valid email'
        });
        return;
    }

    var currentUser = req.user;
    var userId = currentUser._id;
    //console.log("what is user id?: " + objectId);
    Form.createForm(toEmail, req.user.getTemplate(req.body.templateId), userId, function (err, form) {
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
            email_lines.push('Subject: ' + subject);
            email_lines.push('');
            var url = encodeURI('http://localhost:3000/form-entry/' + form.getLink());
            email_lines.push('<p>' + body + '<a href = "' + url + '"> link</a></p>');

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

router.post('/drive', function(req,res,next) {
    var user = req.user;
    user.getForm(req.body.params.id, function(err, form) {
        if(err){
            console.log(err)
        } else {
            var template = form.getTemplate();
            // var text = template.text;
            var templateName = template.name;
            // console.log(template.name)
            var text = dt.htmlstuff(form)
            console.log(" text" + text)
            console.log("form" + form)
            var fname = form.responses[0].response;
            var lname = form.responses[1].response;

            var footerImg = template.footerImg;
            var headerImg = template.letterheadImg;
            // var base64 = footerImg.substring(0, footerImg.indexOf("base64,"));
            var base64footer = footerImg.split("base64,")[1];
            var base64header = headerImg.split("base64,")[1];
            
            // sconsole.log("BASE: " + base64);
            const bufFooter = Buffer.from(base64footer, 'base64');
            const bufHeader = Buffer.from(base64header, 'base64');

            var footStream = new Readable();
            footStream.push(bufFooter);
            footStream.push(null);
            var footerPath = __dirname + '/uploads/' + 'footer.docx';
            footStream.pipe(fs.createWriteStream(footerPath));

            var headStream = new Readable();
            headStream.push(bufHeader);
            headStream.push(null);
            var headerPath = __dirname + '/uploads/' + 'header.docx';
            headStream.pipe(fs.createWriteStream(headerPath));

            var outputName = templateName + "Template_" + fname + "_" + lname + ".docx";
            var output = __dirname + '/uploads/' + outputName;
            docx.leftAlign();
            docx.insertText(text);
            docx.insertDocx(headerPath, function(err){
                docx.insertDocx(footerPath, function(err){

                  docx.save(output, function(){
                    if(err) console.log(err);
                      if(err) {
                        return res.status(500).send(err)
                      } else { 
                          var auth = new googleAuth();
                          var oauth2Client = new OAuth2(credentials.clientId, credentials.clientSecret, credentials.clientCallback);
                          oauth2Client.setCredentials(req.user.accessToken);
                          oauth2Client.credentials = {
                              refresh_token: req.user.accessToken,
                          }
                          const drive = google.drive({version: 'v3', oauth2Client});
                          var fileMetadata = {
                              'name': outputName
                          }

                          var media = {
                              mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                              body: fs.createReadStream(output)
                          };
                          drive.files.create({
                              auth:oauth2Client,
                              resource: fileMetadata,
                              media: media,
                              fields: 'id'
                          }, function (err, file) {
                              if (err) {
                            // Handle error
                               console.error(err);
                              } else {
                                console.log('File Id: ', file.data.id);
                                res.render('pages/letter-preview', {
                                  title: 'Letter Preview for',
                                  id:req.body.params.id

                                })
                         
                              }
                          });
                      }
                    });

                })
            })     
        }

    })
})

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

router.post('/update', function (req, res, next) {
    var user = req.user;

    user.update_linkTemplate_subject(req.body.subject, function (err) {
        if (err) {
            console.log("error in update_linkTemplate_subject: " + err);
            res.send(err);
        } else {
            user.update_linkTemplate_body(req.body.body, function (err) {
                if (err) {
                    console.log("error in update_linkTemplate_body: " + err);
                    res.send(err);
                } else {
                    res.json({
                        success: "Updated Successfully",
                        status: 200
                    });
                }
            });
        }
    });   
});

module.exports = router;