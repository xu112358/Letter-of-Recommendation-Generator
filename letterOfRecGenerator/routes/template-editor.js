var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {
    var letterheadImg;

    if (req.query.id) {
        letterheadImg = req.user.getTemplate(req.query.id).letterheadImg;

        res.render('pages/template-editor', {
            title: 'CREATE A NEW TEMPLATE',
            templateName: req.query.title,
            id: req.query.id,
            letterheadImage: letterheadImg
        });
    } else {
        res.render('pages/template-editor', {
            title: 'CREATE A NEW TEMPLATE',
            templateName: req.query.title,
            id: null,
            letterheadImage: null
        });
    }
});

router.get('/edit', function (req, res, next) {
    if (req.query.id) {
        var letterheadImg = req.user.getTemplate(req.query.id).letterheadImg;
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
        questions: req.user.getTemplate(req.query.id).getQuestions()
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