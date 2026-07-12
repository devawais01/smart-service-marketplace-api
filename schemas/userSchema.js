const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: ["client", "provider", "admin"],
        message: "Role must be client, provider, or admin"
      },
      default: "client"
    },
    skills: {
      type: [String],
      default: []
    },
    portfolio: {
      type: String,
      default: ""
    },
    profileImage: {
      type: String,
      default: ""
    },
    location: {
      type: String,
      default: "",
      trim: true
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.virtual("services", {
  ref: "Service",
  localField: "_id",
  foreignField: "user"
});

module.exports = userSchema;
