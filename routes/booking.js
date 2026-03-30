const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.js");
const { isLoggedIn } = require("../middleware");

router.get("/listings/:id/book", isLoggedIn, bookingController.renderForm);
router.post("/listings/:id/book", isLoggedIn, bookingController.createBooking);
module.exports = router;