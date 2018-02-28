var express = require('express');
var router = express.Router();
var nodemailer = require('nodemailer');

router.use(function (req, res, next) {
    res.locals.statusMessage = null;
    next();
});

router.get('/', function (req, res, next) {
    res.render('pages/recommender-dashboard', {
        title: 'Welcome ' + req.user.displayName + '!',
        data: req.user.getActiveTemplates()
    });
});

router.post('/', function (req, res, next) {
    // nodemailer
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'jsc6d5nbhjlppqts@ethereal.email',
            pass: 'xZdzQ5HHMwNKN2esxS'
        }
    });

    // grab the email from the form
    var email = req.body.email;

    if (!email.length) {
        res.render('pages/recommender-dashboard', {
            title: 'RECOMMENDER DASHBOARD',
            statusMessage: 'Please provide a valid email'
        });
        return;
    }

    // setup email data with unicode symbols
    let mailOptions = {
        from: '<no-reply@example.com>', // sender address
        to: email, // list of receivers
        subject: 'Invitation to Fill Recommendation Letter Questionairre', // Subject line
        text: 'Please click the following questionairre link.', // plain text body
        html: '<p>Please click the following questionairre link.</p>' // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        // Preview only available when sending through an Ethereal account
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    });

    res.render('pages/recommender-dashboard', {
        title: 'RECOMMENDER DASHBOARD',
        statusMessage: 'Email invitation sent!'
    });
});

module.exports = router;