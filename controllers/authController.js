const User = require("../models/User");
const { comparePassword } = require("../utils/password");
const { generateToken } = require("../utils/jwt");
const { isValidRole, normalizeRole } = require("../utils/validators");

const register = async (req, res) => {
  const { name, email, password, role, skills, portfolio, profileImage, location } = req.body || {};

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: "name, email and password are required." });
  }

  const normalizedRole = normalizeRole(role) || "client";
  if (!isValidRole(normalizedRole)) {
    return res.status(400).json({ success: false, error: "Invalid role." });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ success: false, error: "Email already registered." });
  }

  const user = await User.create({
    name,
    email,
    password,
    role: normalizedRole,
    skills: skills || [],
    portfolio: portfolio || "",
    profileImage: profileImage || "",
    location: location || ""
  });

  const token = generateToken(user._id);
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(201).json({
    success: true,
    message: "Registration successful",
    token,
    data: userResponse
  });
};

const login = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "email and password are required." });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await comparePassword(password, user.password))) {
    return res.status(401).json({ success: false, error: "Invalid email or password." });
  }

  const token = generateToken(user._id);
  const userResponse = user.toObject();
  delete userResponse.password;

  res.json({
    success: true,
    message: "Login successful",
    token,
    data: userResponse
  });
};

const logout = async (req, res) => {
  // JWT is stateless — client removes token on logout
  res.json({ success: true, message: "Logout successful. Remove token from client storage." });
};

const getProfile = async (req, res) => {
  res.json({ success: true, data: req.user });
};

const updateProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("+password");
  const { name, email, password, role, skills, portfolio, profileImage, location } = req.body || {};

  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (password !== undefined) user.password = password;
  if (role !== undefined) {
    const normalizedRole = normalizeRole(role);
    if (!normalizedRole) {
      return res.status(400).json({ success: false, error: "Invalid role." });
    }
    user.role = normalizedRole;
  }
  if (skills !== undefined) user.skills = skills;
  if (portfolio !== undefined) user.portfolio = portfolio;
  if (profileImage !== undefined) user.profileImage = profileImage;
  if (location !== undefined) user.location = location;

  await user.save();

  const userResponse = user.toObject();
  delete userResponse.password;

  res.json({ success: true, message: "Profile updated successfully", data: userResponse });
};

module.exports = { register, login, logout, getProfile, updateProfile };
