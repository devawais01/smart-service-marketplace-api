const mongoose = require("mongoose");
const paymentSchema = require("../schemas/paymentSchema");
module.exports = mongoose.model("Payment", paymentSchema);
