const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true
    },
    status: {
      type: String,
      enum: ["Pending", "Accepted", "Completed", "Cancelled"],
      default: "Pending"
    },
    bookingDate: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

module.exports = bookingSchema;
