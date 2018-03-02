var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function(req, res, next) {
    res.render('pages/template-creation', {
        title: 'TEMPLATE CREATION',
    });
});

router.post('/', function(req, res, next) {

	var templateTitle = req.body.title;


    res.render('pages/template-creation', {
        title: `TEMPLATE EDITOR - ${templateTitle}`,
    });
});

module.exports = router;