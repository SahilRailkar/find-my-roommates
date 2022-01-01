const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const User = require("../models/user");

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      (email, password, done) => {
        User.findOne({ email: email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                error: "This email isn't connected to a Rümer account",
                value: "email",
              });
            }

            bcrypt.compare(password, user.password, (err, isMatch) => {
              if (err) {
                throw err;
              }

              if (isMatch) {
                return done(null, user);
              } else {
                return done(null, false, {
                  error: "The password you've entered is incorrect",
                  value: "password",
                });
              }
            });
          })
          .catch((err) => console.log(err));
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user);
    });
  });
};
