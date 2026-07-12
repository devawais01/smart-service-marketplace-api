const User = require("../models/User");
const Service = require("../models/Service");
const { isValidRole, isValidObjectId, normalizeRole } = require("../utils/validators");

const getUsers = async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: 1 });
  res.json({ success: true, count: users.length, data: users });
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid user ID." });
  }

  const user = await User.findById(id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  res.json({ success: true, data: user });
};

const createUser = async (req, res) => {
  const { name, email, password, role, skills, portfolio, profileImage, location, rating, isActive } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ success: false, error: "name and email are required." });
  }

  if (!password) {
    return res.status(400).json({ success: false, error: "password is required." });
  }

  const normalizedRole = normalizeRole(role);
  if (!normalizedRole) {
    return res.status(400).json({ success: false, error: 'role must be client, provider, or admin.' });
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: normalizedRole,
    skills: skills || [],
    portfolio: portfolio || "",
    profileImage: profileImage || "",
    location: location || "",
    rating: rating !== undefined ? Number(rating) : 0,
    isActive: isActive !== undefined ? Boolean(isActive) : true
  });

  const userResponse = newUser.toObject();
  delete userResponse.password;

  res.status(201).json({ success: true, message: "User added successfully", data: userResponse });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid user ID." });
  }

  const user = await User.findById(id).select("+password");
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  const { name, email, password, role, skills, portfolio, profileImage, location, rating, isActive } = req.body || {};

  if (name !== undefined && !name) {
    return res.status(400).json({ success: false, error: "name cannot be empty." });
  }
  if (email !== undefined && !email) {
    return res.status(400).json({ success: false, error: "email cannot be empty." });
  }
  if (role !== undefined) {
    const normalizedRole = normalizeRole(role);
    if (!normalizedRole) {
      return res.status(400).json({ success: false, error: "Invalid role." });
    }
    user.role = normalizedRole;
  }

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.password = password;
  if (skills !== undefined) user.skills = skills;
  if (portfolio !== undefined) user.portfolio = portfolio;
  if (profileImage !== undefined) user.profileImage = profileImage;
  if (location !== undefined) user.location = location;
  if (rating !== undefined) user.rating = Number(rating);
  if (isActive !== undefined) user.isActive = Boolean(isActive);

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.json({ success: true, message: "User updated successfully", data: userResponse });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid user ID." });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  await Service.deleteMany({ user: id });

  res.json({ success: true, message: "User deleted successfully", data: user });
};

const getUserServices = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid user ID." });
  }

  const user = await User.findById(id).select("-password");
  if (!user) {
    return res.status(404).json({ success: false, error: "User not found" });
  }

  const userServices = await Service.find({ user: id })
    .populate("user", "name email role location rating profileImage")
    .sort({ legacyId: 1 });

  res.json({ success: true, count: userServices.length, data: userServices });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserServices
};
