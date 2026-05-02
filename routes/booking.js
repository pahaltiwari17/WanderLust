const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/booking.js");
const { isLoggedIn } = require("../middleware");

// router.get("/listings/:id/book", isLoggedIn, bookingController.renderForm);
// router.post("/listings/:id/book", isLoggedIn, bookingController.createBooking);

router.post("/bookings", async (req, res) => {
    try {
        const booking = new Booking(req.body);
        await booking.save();

        req.flash("success", "Booking Confirmed!");
        return res.redirect("/listings"); // ✅ MUST

    } catch (err) {
        console.log(err);
        req.flash("error", "Booking failed");
        return res.redirect("back");
    }
});

module.exports = router;
