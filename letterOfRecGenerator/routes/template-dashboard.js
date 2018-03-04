var express = require('express');
var router = express.Router();

/* GET Templates page. */
router.get('/', function (req, res, next) {
    res.render('pages/template-dashboard', {
        title: 'TEMPLATE DASHBOARD',
        templates: req.user.getActiveTemplates(),
    });
});

module.exports = router;