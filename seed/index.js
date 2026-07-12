/**
 * Seeds MongoDB with all 50 services from Assignment-1,
 * 20 users from Assignment-2, and 1 admin user.
 */
require("dotenv").config();
const connectDB = require("../database/connection");
const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Message = require("../models/Message");
const Payment = require("../models/Payment");
const { seedCoreData } = require("../utils/seedRunner");

const seedDatabase = async () => {
  const force = process.argv.includes("--force");

  try {
    await connectDB();

    if (force) {
      await Payment.deleteMany({});
      await Message.deleteMany({});
      await Review.deleteMany({});
      await Booking.deleteMany({});
      await Service.deleteMany({});
      await User.deleteMany({});
      console.log("Cleared all collections.");
    } else {
      const count = await Service.countDocuments();
      if (count > 0) {
        console.log(`Database already has ${count} services. Skipping seed.`);
        console.log("Run: npm run seed:force");
        process.exit(0);
      }
    }

    const result = await seedCoreData();
    console.log(`Seeded ${result.users} users (including admin)`);
    console.log(`Seeded ${result.services} services (legacy ids 1–50)`);
    console.log("Default user password: password123");
    console.log("Admin login: admin@marketplace.com / admin123");
    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedDatabase();
