var express = require('express');
var router = express.Router();
var Form = require('../models/form');

/* GET Templates page. */
router.get('/', function (req, res, next) {
    req.user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log(err);
        } else {
            res.render('pages/history', {
                title: form.email,
                emailHistory : form.emailhistory,
                // emailHistory: req.user.getEmailHistory(),
                id: req.query.id,
            });
        }
    });
});

module.exports = router;