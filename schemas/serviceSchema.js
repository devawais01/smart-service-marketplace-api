const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    legacyId: {
      type: Number,
      unique: true,
      sparse: true
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: 0
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      trim: true
    },
    providerName: {
      type: String,
      required: [true, "Provider name is required"],
      trim: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true
    },
    availability: {
      type: Boolean,
      default: true
    },
    // Owner / creator (Assignment-2 user link + Assignment-4 createdBy)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"]
    }
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform(doc, ret) {
        ret.createdBy = ret.user;
        return ret;
      }
    },
    toObject: { virtuals: true }
  }
);

serviceSchema.virtual("serviceId").get(function () {
  return this.legacyId;
});

module.exports = serviceSchema;
