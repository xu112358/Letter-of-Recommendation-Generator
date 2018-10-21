var express = require('express');
var User = require('../models/user');

var router = express.Router();

router.get('/', function (req, res, next) {
    var letterheadImg;
    var footerImg;
    var saveStatus = req.query.saveSwitch;
    if (req.query.id) {
        if(saveStatus=="true"){
            letterheadImg = req.user.getTemplate(req.query.id).letterheadImg;
            footerImg = req.user.getTemplate(req.query.id).footerImg;

            res.render('pages/template-editor', {
                title: 'EDITING TEMPLATE',
                templateName: req.query.title,
                id: req.query.id,
                letterheadImage: letterheadImg,
                footerImage: footerImg,
                saveSwitch: req.query.saveSwitch,
                tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
            });
        } else {
            letterheadImg = req.user.getDeactivatedTemplate(req.query.id).letterheadImg;
            footerImg = req.user.getDeactivatedTemplate(req.query.id).footerImg;

            res.render('pages/template-editor', {
                title: 'VIEWING ARCHIVED TEMPLATE',
                templateName: req.query.title,
                id: req.query.id,
                letterheadImage: letterheadImg,
                footerImage: footerImg,
                saveSwitch: req.query.saveSwitch,
                tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
            });
        }

    } else {
        res.render('pages/template-editor', {
            title: 'CREATE A NEW TEMPLATE',
            templateName: req.query.title,
            id: null,
            letterheadImage: null,
            footerImage: null,
            saveSwitch: true,
            tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
        });
    }
});

router.get('/edit', function (req, res, next) {
    if (req.query.id) {
        var templateName = req.user.getTemplate(req.query.id).getName();
        res.json({
            title: templateName,
            id: req.query.id,
            saveSwitch: true,
            tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
        });
    } else {
        res.json({
            title: null,
            id: null,
            saveSwitch: true,
            tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
        });
    }
});

router.get('/deactivated-edit', function (req, res, next) {
    if (req.query.id) {
        var templateName = req.user.getDeactivatedTemplate(req.query.id).getName();
        res.json({
            title: templateName,
            id: req.query.id,
            saveSwitch: false,
            tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
        });
    } else {
        res.json({
            title: null,
            id: null,
            saveSwitch: false,
            tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
        });
    }
});

router.get('/template', function (req, res, next) {
    if(req.query.saveSwitchData == "true") {
        res.json({
            letter: req.user.getTemplate(req.query.id).getText(),
            questions: req.user.getTemplate(req.query.id).getQuestions(),
            letterheadImg: req.user.getTemplate(req.query.id).getLetterheadImg(),
            footerImg: req.user.getTemplate(req.query.id).getFooterImg(),
            saveSwitch: req.query.saveSwitchData,
            tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
        });
    } else {
        res.json({
            letter: req.user.getDeactivatedTemplate(req.query.id).getText(),
            questions: req.user.getDeactivatedTemplate(req.query.id).getQuestions(),
            letterheadImg: req.user.getDeactivatedTemplate(req.query.id).getLetterheadImg(),
            footerImg: req.user.getDeactivatedTemplate(req.query.id).getFooterImg(),
            saveSwitch: req.query.saveSwitchData,
            tags: ["<!FNAME>", "<!LNAME>", "<!SUB_PRONOUN>", "<!OBJ_PRONOUN>", "<!POS_PRONOUN>" ]
        });
    }
    
});

router.post('/create', function (req, res, next) {
    req.user.addTemplate(req.body.template, function (err, id) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: "Created Successfully",
                status: 200,
                id: id
            });
        }
    });
});

router.post('/update', function (req, res, next) {
    req.user.updateTemplate(req.body.id, req.body.template, function (err, template) {
        if (err) {
            console.log(err);
        } else {
            res.json({
                success: "Updated Successfully",
                status: 200
            });
        }
    });
});

module.exports = router;