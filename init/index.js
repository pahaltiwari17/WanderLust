const mongoose = require("mongoose");
require("dotenv").config({ path: "../.env" });
const axios = require("axios");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require("../models/user.js");

const dbUrl = process.env.ATLASDB_URL;
main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const initDB = async () => {
  await Listing.deleteMany({});
  const user = await User.find();

  initData.data = await Promise.all(
    initData.data.map(async (obj) => {
      try {
        let geoRes = await axios.get("https://api.opencagedata.com/geocode/v1/json", {
          params: {
            q: obj.location,
            key: process.env.GEOCODE_API_KEY
          }
        }
        );
        if (!geoRes.data.results.length) {
          console.log("No results for:", obj.location);
          return {
            ...obj,
            owner: user[Math.floor(Math.random() * user.length)]._id
          }
        }
        let coords = geoRes.data.results[0].geometry;
        return {
          ...obj,
          owner: user[Math.floor(Math.random() * user.length)]._id,
          geometry: {
            type: "Point",
            coordinates: [coords.lng, coords.lat]
          }
        }
      } catch (err) {
        console.log("API error", err.message);
        return {
          ...obj,
          owner: user[Math.floor(Math.random() * user.length)]._id
        }

      }
    }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();