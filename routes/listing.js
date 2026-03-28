const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing, isOwnerRole } = require("../middleware.js");


const listingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    isOwnerRole,
    upload.single("image"),
    wrapAsync(listingController.createListing)
  );

router.get("/new", isLoggedIn, isOwnerRole, listingController.renderNewForm);

router.get("/:id/book", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id);

  if (!listing) {
    req.flash("error", "Listing not found");
    return res.redirect("/listings");
  }

  res.render("bookings/book", { listing });
});

router.post("/:id/book", isLoggedIn, async (req, res) => {
  try {
    const { id } = req.params;
    const { checkIn, checkOut } = req.body;

    console.log("Booking:", checkIn, checkOut);

    req.flash("success", "Booking confirmed!");
    res.redirect(`/listings/${id}`);

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
});

router.get("/search", async (req, res) => {
  const { q } = req.query;

  const listings = await Listing.find({
    $or: [
      { title: { $regex: q, $options: "i" } },
      { location: { $regex: q, $options: "i" } },
      { country: { $regex: q, $options: "i" } },
      { category: { $regex: q, $options: "i" } }
    ]
  });

  res.render("listings/index.ejs", { allListings: listings });
});

router.route("/:id")
  .get(wrapAsync(listingController.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("image"),
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

router.get(
  "/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);


module.exports = router;


