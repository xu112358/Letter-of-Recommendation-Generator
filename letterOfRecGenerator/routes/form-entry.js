var express = require("express");
var router = express.Router();
var Form = require("../models/form");

/* GET form entry page. */
router.get("/:hash", function (req, res, next) {
  Form.findFromLink(req.params.hash, function (err, form) {
    if (err || !form) {
      res.send("Form not found.");
    } else {
      res.render("pages/form-entry", {
        title:
          "Form: " +
          form.getTemplate().getName() +
          ", created " +
          form.getSent() +
          ".",
        questions: form.getTemplate().getQuestions(),
        form: form,
      });
    }
  });
});

/**
 * From form-entry submitForm
 */
router.post("/", function (req, res, next) {
  Form.submitForm(req.body.id, req.body.responseData, function (err) {
    if (err) {
      console.log(err);
      res.send("unable to update responses of user form");
    } else {
      console.log("directing to completed");
      res.render("pages/form-completed", {
        title: "FORM COMPLETED",
      });
    }
  });
});

module.exports = router;
