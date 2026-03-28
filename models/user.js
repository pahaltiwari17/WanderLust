const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose").default || require("passport-local-mongooose");

const userSchema = new Schema({
    role: {
        type: String,
        enum: ["owner", "traveler"],
        default: "traveler"
    },
    email: {
        type: String,
        required: true
    }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
