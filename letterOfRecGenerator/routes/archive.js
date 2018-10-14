var express = require('express');
var router = express.Router();
var Form = require('../models/form');

/* GET Templates page. */
router.get('/', function (req, res, next) {
    req.user.getDeactivatedForms( function (err, deactivatedForms) {
        if (err) {
            console.log(err);
        } else {
            res.render('pages/archive', {
                title: 'Archive Page',
                forms: deactivatedForms,
                templates: req.user.getDeactivatedTemplates(),
            });
        }
    });
});

router.post('/restore-template', function (req, res, next) {
    req.user.activateTemplate(req.body.id, function (err) {
        if (err) {
            console.log(err);
        } else {
            req.user.getDeactivatedForms( function (err, deactivatedForms) {
                if (err) {
                    console.log(err);
                } else {
                    res.render('pages/archive', {
                        title: 'Archive Page',
                        forms: deactivatedForms,
                        templates: req.user.getDeactivatedTemplates(),
                    });
                }
            });
        }
    });
});

module.exports = router;