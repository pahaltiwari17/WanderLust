const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require("../controllers/users.js");
const User = require("../models/user.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware");
const Booking = require("../models/booking");

router.get("/signup", userController.renderSignupForm);
router.post("/signup", userController.signup);
router.get("/login", userController.renderLoginForm);

router.post("/login", passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
}),
    userController.login);

router.get("/logout", userController.logout);

router.get("/dashboard", isLoggedIn, async (req, res) => {
    const userId = req.user._id;
    const listings = await Listing.find({ owner: userId });
    const bookings = await Booking.find({user:userId}).populate("listing");

    res.render("users/dashboard", { listings, bookings });
});

module.exports = router;