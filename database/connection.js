const mongoose = require("mongoose");
const { mongoUri } = require("../config/env");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`MongoDB connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("MongoDB connection error:", error.message);
    console.error("Make sure MongoDB is running and MONGODB_URI in .env is correct.");
    process.exit(1);
  }
};

module.exports = connectDB;
