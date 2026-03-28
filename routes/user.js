const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users.js");
const User = require("../models/user.js");

router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signup);
router.get("/login", userController.renderLoginForm);

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),
    userController.login);

router.get("/logout", userController.logout);

module.exports = router;