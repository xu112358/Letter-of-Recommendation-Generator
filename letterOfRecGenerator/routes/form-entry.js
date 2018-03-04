var express = require('express');
var router = express.Router();
var Form = require('../models/form');
var User = require('../models/user');
var ObjectId = require('mongodb').ObjectID;

/* GET form entry page. */
router.get('/:hash', function(req, res, next) {
    console.log(req.params.hash);
    query = Form.findOne({"link.link": req.params.hash });
    query.exec(function(err, result) {
      console.log(result);
      if (err) {
        res.send("Form not found.");
      } else {
        res.render('pages/form-entry', {
          title: 'Form ' + result.template.name + ' created at ' + result.metadata.sentTimestamp + '.',
          questions: result.template.questions,
          form: result,
        });
      }
    });
});

router.post('/', function(req, res, next) {
    var responseData = req.body.responseData;
    var query = Form.findOne({"template._id": ObjectId(req.body.form.template._id)});
    query.exec(function(err, form) {
      if (err) {
        res.send("Unable to get form");
      } else {
        var responses = form["template"]["questions"].map(function(q) {
          var response = {};
          response["number"] = q.number;
          response["tag"] = q.tag;
          response["response"] = responseData[q.number - 1];
          return response;

        });

        Form.update({_id: form._id}, {responses, status: "Submitted", 'metadata.submittedTimestamp': Date.now()}, {multi: true}, function(err, numAffected){
          if (err) {
            res.send("Unable to update responses of form");
          } else {
            User.update({"forms._id": form._id}, {"forms.$.responses": responses, "forms.$.status": "Submitted", "forms.$.metadata.submittedTimestamp": Date.now()}, {multi: true}, function(err, numAffected) {
              if (err) {
                res.send("unable to update responses of user form");
              } else {
                res.render('pages/form-completed', {
                  title: 'FORM COMPLETED',
                });
              }
            });
          }
        });
      }
    });
});

module.exports = router;