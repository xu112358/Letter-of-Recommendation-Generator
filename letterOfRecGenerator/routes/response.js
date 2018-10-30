var express = require('express');
var User = require('../models/user');
var Form = require('../models/form');

var router = express.Router();

router.get('/', function (req, res, next) {
    var questions =  [];
    req.user.getForm(req.query.id, function (err, form) {
        if(err) {
            console.log(err)
        } else {
            questions = form.getFormattedQuestions();
            console.log("what is questions?: " + questions);
            res.render('pages/response', {
                title: 'Received Responses for ' + form.email,
                id: req.query.id,
                questions: questions,
                responses: form.getResponses(),
            });
        }
    });

});


module.exports = router;