var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.render('pages/letter-preview', {
        title: 'Letter Preview for ' + req.query.name,
    });
});

module.exports = router;