var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var nodemailer = require('nodemailer');
var credentials = require('../config/auth');
var googleAuth = require('google-auth-library');
var { google } = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var letterParser = require('./letter-parser');
const HummusRecipe = require('hummus-recipe');
const fs = require('fs');
const Readable = require('stream').Readable;
const fileUpload = require('express-fileupload');
const opn = require('opn')
const downloadsFolder = require('downloads-folder');


router.get('/', function (req, res, next) {
    req.user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log("get /  error in letter-preivew: " + err );
        } else {
            res.render('pages/letter-preview', {
                title: form.email,
                templates: req.user.getEmailTemplates(),
                id: req.query.id,
                form: form,
            });
        }
    });
});

router.get('/form', function (req, res, next) {
    req.user.getForm(req.query.id, function (err, form) {
        if (err) {
            console.log(err);
        } else {
            res.json(form);
        }
    });
});




router.post('/save', function (req, res, next) {
    Form.completeForm(req.body.id, req.body.letter, function (err, form) {
        if (err) {
            console.log(err);
        } else {
            res.render('pages/letter-preview', {
                title: form.email,
                id: req.query.id,
                form: form,
            });
        }
    });
});

router.post('/drive', function(req,res,next) {
    var user = req.user;
    user.getForm(req.body.id, function(err, form) {
        if(err){
            console.log(err)
        } else {
            var break_lines = "<br><br>";
            var smaller_break_lines = "<br><br>";
            var date_raw = req.body.date;
            var actual_date = letterParser.getDate(date_raw);
            var formatted_date = break_lines + actual_date + smaller_break_lines;
            var letter = req.body.letter;
            var formatted_letter = formatted_date + letter;
            var template = form.getTemplate();
            var templateName = template.name;
            console.log("THIS IS FORMATTED:" + formatted_letter);

            var text = letterParser.htmlstuff(formatted_letter)
            var fname = form.responses[0].response;
            var lname = form.responses[1].response;
            var length = text.length;
            console.log("TEXT:" + text)
            var stringWords = text.split(' ');
            console.log("words: " + stringWords)
            var para = text.split('\n');
            console.log("PAR:" + para)
            var stringlen = stringWords.length;
            console.log("LEN: " + stringlen)
            console.log("PARAG:" + para.length)
            var firstPage = "";
            var secondPage = "";
            // If it is larger than one page break it into two
            for(var i = 0; i < stringlen;i++){
                console.log(stringWords[i])
                if(stringWords[i] === ''){
                    console.log("END")
                }
            }
            if (stringlen > 520){
                 
                for(var i = 0; i < 520;i++){
                    firstPage += stringWords[i];
                    firstPage += " ";
                }
                // Write on first page up until last paragraph
                var counter = 520;
                while(true){
                    console.log(stringWords[counter])
                    if(stringWords[counter] === ''){
                        console.log("BRUH")
                        counter = counter + 1;
                        break;
                    }
                    else {
                        firstPage += stringWords[counter];
                        firstPage += " ";
                    } 
                    counter = counter + 1;
                }

                console.log("LOOP")
                   

                var remain = stringlen - 430;
                
                for(var i = counter; i < stringlen;i++){
                    secondPage += stringWords[i];
                    console.log(stringWords[i])
                    secondPage += " ";
                }

            }

            var headerPath = __dirname + '/uploads/' + 'uploaded.pdf';

            var outputName = templateName + "_Template_" + fname + "_" + lname + ".pdf";
            var downloadFolder = downloadsFolder() + '/';
            var output = downloadFolder + outputName;
            var fontDirectory = __dirname + '/fonts/TIMES.ttf';
            
            const HummusRecipe = require('hummus-recipe');
            const pdfDoc = new HummusRecipe(headerPath, output);
            pdfDoc.registerFont('Times', fontDirectory);
            /**  
             * The current problem is that bolded text that use <strong>txt</strong> can't be
             * converted and kept bold. So we need to find where the location of the text
             * and bold it through hummus-reciper (can be found on npm website for hummus-recipe)
             * but this cannot be done right now.
            */
            if(stringlen > 500){
                pdfDoc
                // edit 1st page
                .editPage(1)
                .text(firstPage, 80, 85, {
                    color: '000000',
                    font: 'Times',
                    fontSize: 11,
                    align: 'left',
                    textBox: {
                        width: 480,
                        lineHeight: 12,
                        style: {
                            lineWidth: 1
                        }
                    }
                })
                .endPage()
                .editPage(2)
                .text(secondPage, 80, 75, {
                    color: '000000',
                    font: 'Times',
                    fontSize: 11,
                    align: 'left',
                    textBox: {
                        width: 480,
                        lineHeight: 12,
                        style: {
                            lineWidth: 1
                        }
                    }
                })
                .endPage()
                .endPDF();
            }
            else {
                pdfDoc
                // edit 1st page
                .editPage(1)
                .text(text, 80, 85, {
                    color: '000000',
                    font: 'Times',
                    fontSize: 11,
                    align: 'left',
                    textBox: {
                        width: 480,
                        lineHeight: 14,
                        style: {
                            lineWidth: 1
                        }
                    }
                })
                .endPage()
                .endPDF();
            }
            opn(output);
        }

    })
})



module.exports = router;