const Listing = require("../models/listing");
const axios = require("axios");

module.exports.index = async (req, res) => {
    const { category } = req.query;

    let allListings;

    if (category) {
        allListings = await Listing.find({ category: category });
    } else {
        allListings = await Listing.find({});
    }

    res.render("listings/index", { allListings, category });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};


module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            }
        });

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};


module.exports.createListing = async (req, res, next) => {
    try {
        console.log("body", req.body);
        console.log("file", req.file);
        const newListing = new Listing(req.body.listing);
        if (newListing.category) {
            newListing.category =
                newListing.category.charAt(0).toUpperCase() +
                newListing.category.slice(1).toLowerCase();
        }
        newListing.owner = req.user._id;
        if (req.file) {
            newListing.image = {
                url: req.file.path,
                filename: req.file.filename
            };
        }
        let geoRes = await axios.get(
            "https://api.opencagedata.com/geocode/v1/json",
            {
                params: {
                    q: req.body.listing.location,
                    key: process.env.GEOCODE_API_KEY
                }
            }
        );

        let coords = geoRes.data.results[0].geometry;
        newListing.geometry = {
            type: "Point",
            coordinates: [coords.lng, coords.lat]
        };

        await newListing.save();
        req.flash("success", "New Listing Created!");
        res.redirect("/listings");
    } catch (err) {
        console.log("error", err);
        res.send("error", err.message);
    }
};


module.exports.renderEditForm = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);

    if (!listing) {
        req.flash("error", "Listing you requested for does not exist!");
        res.redirect("/listings");
    } else {
        let originalImageUrl = listing.image.url;
        originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250");
        res.render("listings/edit.ejs", { listing, originalImageUrl });
    }
};


module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const listing = req.body.listing;
    if (listing.category) {
        listing.category =
            listing.category.charAt(0).toUpperCase() +
            listing.category.slice(1).toLowerCase();
    }
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${listing.location},${listing.country}&key=5c5553872fe24033bf6f25dd80f6d992`);
    if (!response.data.results.length) {
        req.flash("Error", "Invalid Location");
        return res.redirect(`/listings/${id}/edit`);
    }
    const geometry = {
        type: "Point",
        coordinates: [
            response.data.results[0].geometry.lng,
            response.data.results[0].geometry.lat
        ]
    };
    listing.geometry = geometry;

    const updatedListing = await Listing.findByIdAndUpdate(id,
        {
            ...listing,
            geometry: geometry
        },
        { new: true });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        updatedListing.image = { url, filename };
        await updatedListing.save();
    }

    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};

module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let query = {};

  if (category) {
    query.category = category;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { country: { $regex: search, $options: "i" } }
    ];
  }

  const allListings = await Listing.find(query);

  res.render("listings/index", { allListings });
};