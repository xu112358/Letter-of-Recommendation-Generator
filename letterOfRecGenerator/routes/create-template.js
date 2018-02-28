var express = require('express');
var Template = require('../models/template');

var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('pages/create-template', {
        title: 'CREATE A NEW TEMPLATE',
    });
});

router.post('/', function(req, res, next) {
    console.log(req.body.template);
    Template.create(req.body.template, function (err, template) {
        if(err) {
            console.log('error');
        }

        req.user.templates.push(template);
        req.user.save();

        console.log(template);
    });
});

module.exports = router;