const User = require("../models/User");
const Service = require("../models/Service");
const { hashPassword } = require("./password");
const usersData = require("../seed/usersData");
const servicesData = require("../seed/servicesData");

const seedCoreData = async () => {
  const usersToInsert = await Promise.all(
    usersData.map(async (user) => ({
      name: user.name,
      email: user.email,
      password: await hashPassword(user.password || "password123"),
      role: user.role,
      skills: user.role === "provider" ? ["Web Design", "Freelancing"] : [],
      portfolio: "",
      profileImage: "",
      location: user.location || "",
      rating: user.rating ?? 0,
      isActive: user.isActive !== undefined ? user.isActive : true
    }))
  );

  const adminUser = {
    name: "Admin User",
    email: "admin@marketplace.com",
    password: await hashPassword("admin123"),
    role: "admin",
    skills: ["Management", "Administration"],
    portfolio: "Platform administrator",
    profileImage: "",
    location: "Karachi",
    rating: 5,
    isActive: true
  };

  const createdUsers = await User.insertMany([...usersToInsert, adminUser]);

  const servicesToInsert = servicesData.map((service, index) => ({
    legacyId: service.id,
    title: service.title,
    description: service.description,
    price: service.price,
    category: service.category,
    providerName: service.providerName,
    rating: service.rating,
    location: service.location,
    availability: service.availability !== undefined ? service.availability : true,
    user: createdUsers[index % usersData.length]._id
  }));

  const createdServices = await Service.insertMany(servicesToInsert);

  return {
    users: createdUsers.length,
    services: createdServices.length
  };
};

const ensureAdminUser = async () => {
  const exists = await User.findOne({ email: "admin@marketplace.com" });
  if (exists) return exists;

  return User.create({
    name: "Admin User",
    email: "admin@marketplace.com",
    password: "admin123",
    role: "admin",
    skills: ["Management"],
    portfolio: "Platform administrator",
    location: "Karachi"
  });
};

module.exports = { seedCoreData, ensureAdminUser };
