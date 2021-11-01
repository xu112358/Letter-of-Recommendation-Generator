var express = require('express');
var router = express.Router();


/* GET form entry page. */
router.get('/', function(req, res, next) {
    res.render('pages/form-completed', {
        title: 'The form was submitted successfully',
    });
    //sending email confirmation has been moved to form-entry
});

module.exports = router;
