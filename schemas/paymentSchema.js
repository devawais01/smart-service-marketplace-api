const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    status: {
      type: String,
      enum: ["Pending", "Paid"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

module.exports = paymentSchema;
