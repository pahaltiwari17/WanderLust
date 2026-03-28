const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  name: String,
  city: String,
  price: Number,
  rating: Number,
  image: String
});

module.exports = mongoose.model("Service", serviceSchema);