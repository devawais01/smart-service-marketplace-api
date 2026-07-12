const mongoose = require("mongoose");
const serviceSchema = require("../schemas/serviceSchema");

module.exports = mongoose.model("Service", serviceSchema);
