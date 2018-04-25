var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {
    var letterheadImg;
    var footerImg;

    if (req.query.id) {
        letterheadImg = req.user.getTemplate(req.query.id).letterheadImg;
        footerImg = req.user.getTemplate(req.query.id).footerImg;

        res.render('pages/template-editor', {
            title: 'CREATE A NEW TEMPLATE',
            templateName: req.query.title,
            id: req.query.id,
            letterheadImage: letterheadImg,
            footerImage: footerImg
        });
    } else {
        res.render('pages/template-editor', {
            title: 'CREATE A NEW TEMPLATE',
            templateName: req.query.title,
            id: null,
            letterheadImage: null,
            footerImage: null
        });
    }
});

router.get('/edit', function (req, res, next) {
    if (req.query.id) {
        var templateName = req.user.getTemplate(req.query.id).getName();

        res.json({
            title: templateName,
            id: req.query.id
        });
    } else {
        res.json({
            title: null,
            id: null,
        });
    }
});

router.get('/template', function (req, res, next) {
    res.json({
        letter: req.user.getTemplate(req.query.id).getText(),
        questions: req.user.getTemplate(req.query.id).getQuestions(),
        letterheadImg: req.user.getTemplate(req.query.id).getLetterheadImg(),
        footerImg: req.user.getTemplate(req.query.id).getFooterImg(),
    });
});

router.post('/create', function (req, res, next) {
    req.user.addTemplate(req.body.template, function (err, id) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: "Created Successfully",
                status: 200,
                id: id
            });
        }
    });
});

router.post('/update', function (req, res, next) {
    req.user.updateTemplate(req.body.id, req.body.template, function (err, template) {
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