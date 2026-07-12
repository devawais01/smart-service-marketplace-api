const mongoose = require("mongoose");
const reviewSchema = require("../schemas/reviewSchema");
module.exports = mongoose.model("Review", reviewSchema);
