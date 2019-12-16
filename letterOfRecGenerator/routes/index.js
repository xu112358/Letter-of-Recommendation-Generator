var express = require('express');
var User = require('../models/user');
var router = express.Router();

router.use(function (req, res, next) {
    res.locals.userValue = null;
    next();
});

//router.get('/', (req, res) => res.render('welcome'));
router.get('/dashboard', (req, res) => res.render('dashboard'));

// Get Home Page
router.get('/', function (req, res, next) {
    res.render('pages/index', {
        title: 'Express',
        header: 'Add user'
    });
});

router.post('/', function (req, res) {
    var user = {
        name: {
            first: req.body.fname,
            last: req.body.lname
        }
    };

    User.createUser(user);

    res.render('pages/index', {
        title: 'Express',
        header: 'Add User',
        userValue: user.name
    });
});

module.exports = router;
