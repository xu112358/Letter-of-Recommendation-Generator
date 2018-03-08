var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('pages/create-template', {
        title: 'CREATE A NEW TEMPLATE',
        templateName: req.query.title,
    });
});

router.post('/create', function (req, res, next) {
    req.user.addTemplate(req.body.template, function (err, id) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: "Updated Successfully",
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
        }
    });
});

module.exports = router;