const express = require("express");

const { logInUser, logOutUser, signUpUser } = require("../controllers/user");

const router = express.Router();

router.post("/signup", signUpUser);
router.post("/login", logInUser);
router.post("/logout", logOutUser);

module.exports = router;
