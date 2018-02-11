var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('login', {
        title: 'LETTER OF RECOMMENDATION GENERATOR',
        subtitle: 'Made with love by group 28.',
    });
});

module.exports = router;