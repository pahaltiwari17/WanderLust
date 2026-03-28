const Booking = require("../models/booking");
const Listing = require("../models/listing");

module.exports.renderForm = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("bookings/book", { listing });
};

module.exports.createBooking = async (req, res) => {
  const { id } = req.params;
  const { checkIn, checkOut } = req.body;

  const listing = await Listing.findById(id);

  const days = (new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24);

  const totalPrice = days * listing.price;

  const booking = new Booking({
    listing: id,
    user: req.user._id,
    checkIn,
    checkOut,
    totalPrice
  });

  await booking.save();

  req.flash("success", "Booking Confirmed!");
  res.redirect(`/listings/${id}`);
};