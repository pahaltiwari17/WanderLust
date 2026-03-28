const express = require("express");
const router = express.Router();
const Plan = require("../models/plan");

router.get("/", async (req, res) => {
  const plans = await Plan.find({});
  res.render("plans/index", { plans });
});

router.get("/new", (req, res) => {
  res.render("plans/new");
});

router.get("/:id", async (req, res) => {
  const plan = await Plan.findById(req.params.id);
  res.render("plans/show", { plan });
});

router.post("/", async (req, res) => {
  const { title, description, places, budget } = req.body.plan;

  const newPlan = new Plan({
    title,
    description,
    places: places.split(",").map(p => p.trim()), 
    budget
  });

  await newPlan.save();
  res.redirect("/plans");
});
module.exports = router;