var express = require('express');
var router = express.Router();

/* GET form entry page. */
router.get('/', function(req, res, next) {
    questions = [
        {
            number: 0,
            text: 'Talk about your extracurriculars (in 3rd person form).',
            type: 'long-response',
        },
        {
            number: 1,
            options: [
                'PHD',
                'Grad School',
                'Job',
            ],
            text: 'Type of letter of rec:',
            type: 'radio-button',
        },
        {
            number: 2,
            options: [
                'CSCI 201',
                'CSCI 401',
            ],
            text: 'Select the classes you\'ve taken:',
            type: 'checkbox',
        },
    ]
    res.render('pages/form-entry', {
        title: 'FORM ENTRY',
        questions,
    });
});

router.post('/', function(req, res, next) {
    console.log(req.body);

    res.render('pages/form-completed', {
        title: 'FORM COMPLETED',
    });
});

module.exports = router;