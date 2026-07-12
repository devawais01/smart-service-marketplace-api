const mongoose = require("mongoose");
const bookingSchema = require("../schemas/bookingSchema");
module.exports = mongoose.model("Booking", bookingSchema);
