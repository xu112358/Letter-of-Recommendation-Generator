var express = require('express');
var router = express.Router();


/* GET form entry page. */
router.get('/', function(req, res, next) {
    res.render('pages/form-completed', {
        title: 'Form Completed!',
    });
    //sending email confirmation has been moved to form-entry
});

module.exports = router;
