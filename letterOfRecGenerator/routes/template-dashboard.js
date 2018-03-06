var express = require('express');
var router = express.Router();

/* GET login page. */
router.get('/', function (req, res, next) {
    res.render('pages/template-dashboard', {
        title: 'TEMPLATE DASHBOARD',
        data: req.user.getActiveTemplates()
    });
});

module.exports = router;