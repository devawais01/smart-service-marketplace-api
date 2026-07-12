const User = require("../models/User");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Message = require("../models/Message");
const Payment = require("../models/Payment");
const { seedCoreData, ensureAdminUser } = require("../utils/seedRunner");

const seedIfEmpty = async () => {
  const serviceCount = await Service.countDocuments();

  if (serviceCount > 0) {
    await ensureAdminUser();
    return { seeded: false, users: await User.countDocuments(), services: serviceCount };
  }

  const result = await seedCoreData();
  return { seeded: true, users: result.users, services: result.services };
};

module.exports = seedIfEmpty;
