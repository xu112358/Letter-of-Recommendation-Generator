// var express = require('express');
// var router = express.Router();

// /* GET login page. */
// router.get('/', function (req, res, next) {
//     res.render('pages/docx', {
//         title: 'DOCX DEMO',
//         subtitle: '', 
//         url: 'pages/docx'
//     });
// });

// module.exports = router;

const docx = require('docx');
const fs = require('fs');
const request = require('request');
const express = require('express');
const router = express.Router();

const { Document, Paragraph, Packer } = docx;

// https://stackoverflow.com/questions/12740659/downloading-images-with-node-js
const download = (uri, filename, callback) => {
  request.head(uri, (err, res, body) => {
    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

const URL = 'https://raw.githubusercontent.com/dolanmiu/docx/ccd655ef8be3828f2c4b1feb3517a905f98409d9/demo/images/cat.jpg';

router.get('/', (req, res) => {
    download(URL, 'cat.jpg', async () => {
        const doc = new Document();
        const paragraph = new Paragraph("Hello World");
        doc.addParagraph(paragraph);

        const image = doc.createImage(fs.readFileSync('./cat.jpg'));

        doc.Header.createImage(fs.readFileSync('./cat.jpg'));
    	doc.Footer.createImage(fs.readFileSync('./cat.jpg'));
        
        const packer = new Packer();

        const b64string = await packer.toBase64String(doc);

        res.setHeader('Content-Disposition', 'attachment; filename=My Document.docx');
        res.send(Buffer.from(b64string, 'base64'));
    });
});

module.exports = router;