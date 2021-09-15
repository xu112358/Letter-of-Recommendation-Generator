var express = require("express");
var User = require("../models/user");
var router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
var jwt_decode = require("jwt-decode");

/* GET users listing. */
router.get("/", function (req, res, next) {
  User.find(function (err, results) {
    if (err) {
      res.send("Oops...");
    } else {
      res.send(results);
    }
  });
});

// Get Login page
router.get("/login", (req, res) => res.render("login"));


// Login handle
router.post("/login", (req, res, next) => {
  const linkTemplate_body = "Please click the following questionnaire ";
  const linkTemplate_subject =
    "Invitation to Fill Recommendation Letter Questionnaire";

  var userProfile = jwt_decode(req.body.credential);
  console.log(userProfile);

  var userEmail = userProfile.email;
  var name = userProfile.name;

  User.findOne({ email: userEmail }).then((user) => {
    if (user) {
      console.log("user in system");
      user.save();
      req.login(user, function (err) {
        if (err) {
          return next(err);
        }
        return res.redirect("/recommender-dashboard");
      });
    } else {
      console.log("user not in system");
      //use user's name to hash to password
      const newUser = new User({
        email: userEmail,
        password: '',
        name,
        linkTemplate_subject,
        linkTemplate_body,
      });

  
      newUser
        .save()
        .then((user) => {
          req.login(user, function (err) {
            if (err) {
              return next(err);
            }
            return res.redirect("/recommender-dashboard");
          });
        })
        .catch((err) => console.log(err));
    
      
    }
  });
});

// Logout handle
// router.get('/logout', (req, res) => {
//   req.logout();
//   req.flash('success_msg', 'You are logged out');
//   res.redirect('/users/login');
// });

module.exports = router;
