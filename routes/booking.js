const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking");
const { isLoggedIn } = require("../middleware");

router.get("/listings/:id/boook", isLoggedIn, bookingController.renderForm);
bookingController.renderForm;

router.post("/listings/:id/book", isLoggedIn, bookingController.createBooking);
module.exports = router;