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

// Get Register page
router.get("/register", (req, res) => res.render("register"));

// Get Login page
router.get("/login", (req, res) => res.render("login"));

//Register handle
router.post("/register", (req, res) => {
  const { email, password, password2 } = req.body;
  const linkTemplate_body = "Please click the following questionnaire ";
  const linkTemplate_subject =
    "Invitation to Fill Recommendation Letter Questionnaire";

  let errors = [];

  if (!email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      email,
      password,
      password2,
    });
  } else {
    // Validation passes
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          email,
          password,
          linkTemplate_subject,
          linkTemplate_body,
        });

        console.log(newUser);

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login handle
router.post("/login", (req, res, next) => {
  const linkTemplate_body1 = "Please click the following questionnaire ";
  const linkTemplate_subject1 =
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
        password: name,
        linkTemplate_subject: linkTemplate_subject1,
        linkTemplate_body: linkTemplate_body1,
        firstName: userProfile.given_name,
        lastName: userProfile.family_name,
        isProfileSet: false,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
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
        });
      });
    }
  });
});

//user profile handle
router.get("/profile", (req, res) => {
  //if user is not logged in, put them back to home page
  if (!req.user) {
    res.redirect("/");
  }

  res.render("pages/profile", {
    title: "Profile",
  });
});

//update user profile
router.post("/profile", (req, res) => {
  let userInfo = req.body.userInfo;

  User.findOne({ email: req.user.email }).then((user) => {
    user.firstName = userInfo[0];
    user.middleName = userInfo[1];
    user.lastName = userInfo[2];
    user.titles = userInfo[3];
    user.phone = userInfo[4];
    user.school = userInfo[5];
    user.address = userInfo[6];

    console.log(user);

    //update db
    user
      .save()
      .then((user) => {
        //update the logged in user
        req.user = user;
        res.sendStatus(200);
        console.log("user updated");
        console.log(req.user);
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  });
});

router.get("/profile/get", (req, res) => {
  res.json(req.user);
});

module.exports = router;
