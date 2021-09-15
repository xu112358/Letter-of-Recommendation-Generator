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
        callbackURL: "/user/login/callback",
      },
      function (accessToken, refreshToken, profile, done) {
        coonsole.log(profile);
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

  // OLD code
  function extractProfile(profile) {
    return {
      id: profile.id,
      displayName: profile.displayName,
    };
  }

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
};

// Similar, but OLD code
// passport.deserializeUser(function (id, done) {
//     User.findUser(id, function (err, user) {
//         done(err, user);
//     });
// });

// OLD - Google Auth Strategy
// passport.use(new GoogleStrategy({
//     clientID: auth.clientId,
//     clientSecret: auth.clientSecret,
//     callbackURL: auth.clientCallback
// }, function (token, refreshToken, profile, done) {
//     process.nextTick(function () {
//
//         // Find the user based on their google id
//         var details = extractProfile(profile);
//         User.findOrCreate(details.id, function (err, user) {
//             if (err) {
//                 done(err, null);
//             }
//
//             user.displayName = details.displayName;
//             user.accessToken = token;
//             user.save();
//             done(null, user);
//         });
//     });
//

//module.exports = passport;
