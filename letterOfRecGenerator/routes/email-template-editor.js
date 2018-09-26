var express = require('express');
var User = require('../models/user');

var router = express.Router();

// router.get('/', function (req, res, next) {
//     req.user.getForm(req.query.id, function (err, form) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.render('pages/letter-preview', {
//                 title: 'Send a confirmation email for ' + form.email,
//                 templates: req.user.getEmailTemplates(),
//                 id: req.query.id,
//             });
//         }
//     });
// });


router.get('/', function (req, res, next) {

    if (req.query.id) {
        templateName = req.user.getEmailTemplate(req.query.id).title;
        subject = req.user.getEmailTemplate(req.query.id).subject;
        body = req.user.getEmailTemplate(req.query.id).body_text;

        res.render('pages/email-template-editor', {
            title: 'CREATE A NEW EMAIL TEMPLATE',
            templateName: templateName,
            templates: req.user.getEmailTemplates(),
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
    req.user.addEmailTemplate(req.body.Email, function (err, id) {
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

// router.get('/template', function (req, res, next) {
//     res.json({
//         title: req.user.getTemplate(req.query.id).getTitle(),
//         subject: req.user.getTemplate(req.query.id).getSubject(),
//         body: req.user.getTemplate(req.query.id).getBodyText(),
//     });
// });

// router.get('/template', function (req, res, next) {
//     res.json({
//         letter: req.user.getTemplate(req.query.id).getText(),
//         questions: req.user.getTemplate(req.query.id).getQuestions(),
//         letterheadImg: req.user.getTemplate(req.query.id).getLetterheadImg(),
//         footerImg: req.user.getTemplate(req.query.id).getFooterImg(),
//     });
// });

// router.post('/create', function (req, res, next) {
//     req.user.addTemplate(req.body.template, function (err, id) {
//         if (err) {
//             console.log(err);
//         } else {
//             res.json({
//                 success: "Created Successfully",
//                 status: 200,
//                 id: id
//             });
//         }
//     });
// });

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