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
    var gmailClass = google.gmail('v1');

    var email_lines = [];
    var toEmail = req.body.email;

    if (!toEmail.length) {
        res.render('pages/recommender-dashboard', {
            title: 'RECOMMENDER DASHBOARD',
            statusMessage: 'Please provide a valid email'
        });
        return;
    }
    email_lines.push('From: "test" <pcarion@gmail.com>');
    email_lines.push('To: ' + email);
    email_lines.push('Content-type: text/html;charset=iso-8859-1');
    email_lines.push('MIME-Version: 1.0');
    email_lines.push('Subject: Invitation to Fill Recommendation Letter Questionairre');
    email_lines.push('And this would be the content.<br/>');
    email_lines.push('The body is in HTML so <b>we could even use bold</b>');

    var email = email_lines.join('\r\n').trim();
    var base64EncodedEmail = new Buffer(email).toString('base64');
    base64EncodedEmail = base64EncodedEmail.replace(/\+/g, '-').replace(/\//g, '_');

    gmailClass.users.messages.send({
      auth: auth,
      userId: 'me',
      resource: {
        raw: base64EncodedEmail
      }
    }, cb);

    // grab the email from the form
    

    // setup email data with unicode symbols
    let mailOptions = {
        from: '<no-reply@example.com>', // sender address
        to: email, // list of receivers
        subject: '', // Subject line
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