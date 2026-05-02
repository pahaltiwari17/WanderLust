const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.renderForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("bookings/book", { listing });
};

module.exports.createBooking = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { id } = req.params;
    const checkIn = req.body.checkIn;
    const checkOut = req.body.checkOut;

    console.log("CheckIn:", checkIn, "CheckOut:", checkOut);

    const checkInDate = new Date(checkIn);
const checkOutDate = new Date(checkOut);

if (checkOutDate <= checkInDate) {
    req.flash("error", "Check out date is invalid!");
    return res.redirect(`/listings/${id}`);
}

    const listing = await Listing.findById(id);

    if (!listing) {
      console.log("Listing not found");
      return res.redirect("/listings");
    }

    const days =
      (new Date(checkOut) - new Date(checkIn)) /
      (1000 * 60 * 60 * 24);

    const totalPrice = days * listing.price;

    const booking = new Booking({
      listing: id,
      user:req.user ? req.user._id:null,//req.user._id
      checkIn,
      checkOut,
      totalPrice,
    });

    await booking.save();

    console.log("Saved booking ID:", booking._id);

    req.flash("success", "Booking Confirmed!");
    res.redirect("/listings/" + id);

  } catch (err) {
    console.log("ERROR:", err);
    res.send("Error occurred");
  }
};
