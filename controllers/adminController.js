const User = require("../models/User");
const Service = require("../models/Service");

const getAllUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: 1 });
  res.json({ success: true, count: users.length, data: users });
};

const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found." });
  }
  await Service.deleteMany({ user: req.params.id });
  res.json({ success: true, message: "User deleted by admin", data: user });
};

const getAllServices = async (req, res) => {
  const services = await Service.find().populate("user", "name email role").sort({ legacyId: 1 });
  res.json({ success: true, count: services.length, data: services });
};

const deleteService = async (req, res) => {
  const service = await Service.findByIdAndDelete(req.params.id);
  if (!service) {
    return res.status(404).json({ success: false, error: "Service not found." });
  }
  res.json({ success: true, message: "Service deleted by admin", data: service });
};

module.exports = { getAllUsers, deleteUser, getAllServices, deleteService };
