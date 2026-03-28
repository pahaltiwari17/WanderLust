const mongoose = require("mongoose");

const planSchema = new mongoose.Schema({
  title: String,
  description: String,
  places: [String],
  budget: Number,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Plan", planSchema);