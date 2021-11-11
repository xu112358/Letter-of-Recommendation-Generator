//var passport = require('passport');
var LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcryptjs");
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
//var auth = require('./auth');

// Load User model
var User = require("../models/user");

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID:
          "946973074370-6k1l3346s9i1jtnj3tf7j797vtc6ua3j.apps.googleusercontent.com",
        clientSecret: "xL4Oa8jms2i_jnwzLhFzO1XR",
      },
      function (accessToken, refreshToken, profile, done) {
        console.log("google signin callback");
        User.findOrCreate({ email: profile.email }, function (err, user) {
          if (err) {
            done(err, user);
          }

          
          user.displayName = profile.name;
          user.accessToken = accessToken;
          user.save();
          done(null, user);
        });
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};
