const express = require("express");
const router = express.Router();
const Service = require("../models/service");

router.get("/", async (req, res) => {
  const services = await Service.find({});
  res.render("services/index", { services });
});

module.exports = router;