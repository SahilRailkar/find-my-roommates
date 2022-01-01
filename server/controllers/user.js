const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/user");

const signUpUser = async (req, res) => {
  let body = req.body;

  if (!body) {
    return res.status(400).json({
      success: false,
      error: "You must provide user information",
    });
  }
  if (body.password) {
    body.password = await bcrypt.hash(body.password, 10);
  }

  const user = new User(body);

  if (!user) {
    return res.status(400).json({
      success: false,
      error: "You must provide all required user information",
    });
  }

  User.findOne({ email: body.email }, (err, doc) => {
    if (err) throw err;
    if (doc)
      return res.status(400).json({
        success: false,
        error: "There is already a Rümer account associated with this email",
        value: "email",
      });

    if (!doc) {
      user
        .save()
        .then(() => {
          return res.status(201).json({
            success: true,
            id: user._id,
            message: "User created",
          });
        })
        .catch((err) => {
          return res.status(400).json({
            success: false,
            err,
            message: "User not created",
          });
        });
    }
  });
};

const logInUser = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      return res.status(400).json({
        ...info,
        success: false,
      });
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        return res.status(200).json({
          success: true,
          message: "Successfully authenticated user",
        });
      });
    }
  })(req, res, next);
};

const logOutUser = (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.status(200).json({
      success: true,
      message: "Successfully logged out user",
    });
  } else {
    return res.status(400).json({
      success: false,
      error: "No user was logged in",
    });
  }
};

module.exports = {
  signUpUser,
  logInUser,
  logOutUser,
};
