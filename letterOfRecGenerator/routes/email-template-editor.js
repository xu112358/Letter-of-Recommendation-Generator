var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {

    if (req.query.id) {
        templateName = req.user.getEmailTemplate(req.query.id).title;
        subject = req.user.getEmailTemplate(req.query.id).subject;
        body = req.user.getEmailTemplate(req.query.id).body_text;

        res.render('pages/email-template-editor', {
            title: 'CREATE A NEW EMAIL TEMPLATE',
            templateName: templateName,
            templates: req.user.getEmailTemplates(),
            tags: ["<!NAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ],
            id: req.query.id,
            subject: subject,
            body: body
        });
    }else {
            res.render('pages/email-template-editor', {
                title: 'CREATE A NEW TEMPLATE',
                templateName: req.query.title,
                templates: req.user.getEmailTemplates(),
                id: req.query.id,
                subject: null,
                body: null
            });
        }
});

router.post('/addEmailTemplate', function (req, res, next) {
    req.user.FindOrAddEmailTemplate(req.body.Email, function (err, id) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: "Created Successfully",
                status: 200,
                id:id
            });
        }
    });
});

router.get('/edit', function (req, res, next) {
    if (req.query.id) {
        var templateName = req.user.getEmailTemplate(req.query.id).getTitle();
        var subject = req.user.getEmailTemplate(req.query.id).getSubject();
        var body = req.user.getEmailTemplate(req.query.id).getBodyText();
        res.json({
            title: 'EDIT AN EMAIL TEMPLATE',
            templateName: templateName,
            subject: subject,
            body: body,
            id: req.query.id
        });
    } else {
        res.json({
            title: null,
            id: null,
        });
    }
});

router.post('/update', function (req, res, next) {
    req.user.updateEmailTemplate(req.body.id, req.body.Email, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: "Updated Successfully",
                status: 200
            });
        }
    });
});



module.exports = router;