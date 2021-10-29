var express = require("express");
var User = require("../models/user");
var router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(
  "946973074370-6k1l3346s9i1jtnj3tf7j797vtc6ua3j.apps.googleusercontent.com"
);
var jwt_decode = require("jwt-decode");
var jwt = require("jsonwebtoken");
var fs = require("fs");
var path = require("path");
var Validator = require("jsonschema").Validator;

//secret for JWT encoding

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
router.post("/login", async (req, res, next) => {
  const linkTemplate_body1 = "Please click the following questionnaire ";
  const linkTemplate_subject1 =
    "Invitation to Fill Recommendation Letter Questionnaire";

  //verify google JWT token to prevent CSRF attacks
  var csrf_token_cookie = req.cookies.g_csrf_token;
  var csrf_token_body = req.body.g_csrf_token;
  if (
    !csrf_token_cookie ||
    !csrf_token_body ||
    csrf_token_body != csrf_token_cookie
  ) {
    res.status(400).json({ error: "Failed to verify CSRF token" });
  }

  //verify JWT's signature
  let status = true;
  await verify(req.body.credential).catch((err) => {
    console.log(err);
    status = false;
  });
  //extract userInfo
  var userProfile = jwt_decode(req.body.credential);
  //authentication with jwt
  //our token expires in 1h
  var privateKey = fs.readFileSync(
    path.join(__dirname, "../config/jwtRS256.key")
  );
  var mytoken = jwt.sign(
    {
      iss: "Letter of Recommendation Generator",
      aud: "946973074370-6k1l3346s9i1jtnj3tf7j797vtc6ua3j.apps.googleusercontent.com",
      email: userProfile.email,
    },
    privateKey,
    { algorithm: "RS256", expiresIn: "1h" }
  );

  var publicKey = fs.readFileSync(
    path.join(__dirname, "../config/jwtRS256.key.pub")
  );
  var decoded = jwt.verify(mytoken, publicKey);

  //failed signature verification
  if (!status) {
    res.status(400).json({ error: "Failed to verify signature" });
  } else {
    //signature verified
    //we will go ahead and use google jwt token to create our own jwt

    var userEmail = userProfile.email;
    var name = userProfile.name;

    //check if this user is in system
    User.findOne({ email: userEmail }).then((user) => {
      if (user) {
        console.log("user in system");
        user.save();
        //since redirect will not pass any headers forward
        //we will use cookie get our header in
        //new login using JWT token

        res.cookie("auth", mytoken);
        res.redirect("/recommender-dashboard");
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
          middleName: "",
          university: "",
          department: "",
          titles: "",
          codes: "",
          phone: "",
          streetAddress: "",
          address2: "",
          city: "",
          statesProvinces: "",
          postalCode: "",
          country: "",
          selectedIndex: "",
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                //send jwt back using cookie
                res.cookie("auth", mytoken);
                res.redirect("/recommender-dashboard");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

//user profile handle
router.get("/profile", (req, res) => {
  res.render("pages/profile", {
    title: "Profile",
  });
});

//update user profile
router.post("/profile", async (req, res) => {
  var decoded = jwt_decode(req.headers.authorization.replace("Bearer ", ""));
  var data = JSON.parse(req.body.raw);

  //validate data from request
  var check = new Validator();
  var schema = {
    id: "/UserProfileSchema",
    type: "object",
    properties: {
      firstName: { type: "string" },
      middleName: { type: "string" },
      lastName: { type: "string" },
      university: { type: "string" },
      department: { type: "string" },
      titles: { type: "string" },
      codes: { type: "string" },
      phone: { type: "string" },
      streetAddress: { type: "string" },
      address2: { type: "string" },
      statesProvinces: { type: "string" },
      postalCode: { type: "string" },
      country: { type: "string" },
      selectedIndex: { type: "integer" },
      required: [
        "firstName",
        "lastName",
        "university",
        "department",
        "titles",
        "codes",
        "phone",
        "streetAddress",
        "statesProvinces",
        "postalCode",
        "country",
        "selectedIndex",
      ],
    },
  };
  var result = check.validate(data, schema);

  //validation failed
  if (!result) {
    console.log("Invalid request paramaters");
    return res.status(400).json({ error: "Invalid request paramaters" });
  }

  //use regex to match postalCodes, phone number and selectedIndex
  var postalCheck = /^\d{5}(-\d{4})?$/;
  var phoneCheck = /\d{5,}/;
  var selectedIndexCheck = /\d{1,3}/;
  var codesCheck = /\+\d{1,3}|\+\d{1}\-\d{3}/;

  //postal failed to match
  if (!postalCheck.test(data.postalCode)) {
    console.log("Invalid postalCode");
    return res.status(400).json({ error: "Invalid postal code" });
  }
  //not a valid phone number
  if (!phoneCheck.test(data.phone)) {
    console.log("Invalid telephone number");
    return res.status(400).json({ error: "Invalid telephone number" });
  }
  //not a number or index out of bounds (total of 248 entries so far in country_code_and_details.json)
  if (
    !selectedIndexCheck.test(data.selectedIndex) ||
    data.selectedIndex > 247
  ) {
    console.log("Invalid index");
    return res.status(400).json({ error: "Invalid index" });
  }
  //not a valid formatted country code
  if (!codesCheck.test(data.codes)) {
    console.log("Invalid codes");
    return res.status(400).json({ error: "Invalid codes" });
  }

  //retrive user obj from mongodb
  var user_ = await User.findOne({ email: decoded.email });
  User.findOne({ email: user_.email }).then((user) => {
    //update db
    user.firstName = data.firstName;
    user.middleName = data.middleName;
    user.lastName = data.lastName;
    user.university = data.university;
    user.department = data.department;
    user.titles = data.titles;
    user.codes = data.codes;
    user.phone = data.phone;
    user.streetAddress = data.streetAddress;
    user.address2 = data.address2;
    user.statesProvinces = data.statesProvinces;
    user.postalCode = data.postalCode;
    user.country = data.country;
    user.selectedIndex = data.selectedIndex;
    user.isProfileSet = true;

    user
      .save()
      .then((user) => {
        //updated profile, so user is not new anymore
        delete req.cookies.new;
        res.sendStatus(200);
        console.log("user updated");
      })
      .catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
  });
});

router.get("/profile/get", async (req, res) => {
  var decoded = jwt_decode(req.headers.authorization.replace("Bearer ", ""));

  //retrive user obj from mongodb
  var user = await User.findOne({ email: decoded.email });
  console.log(decoded.email);
  res.json(user);
});

//google jwt token verification function
async function verify(token) {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience:
      "946973074370-6k1l3346s9i1jtnj3tf7j797vtc6ua3j.apps.googleusercontent.com",
  });
}

module.exports = router;
