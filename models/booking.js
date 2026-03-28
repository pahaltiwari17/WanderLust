const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    listing:{
        type: Schema.Types.ObjectId,
        ref:"Listing",
        required:true
    },
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    chechkIn:Date,
    checkOut:Date,
    totalPrice: Number,
}, {timestamps:true});

moduleexports = mongoose.model("Booking", bookingSchema);