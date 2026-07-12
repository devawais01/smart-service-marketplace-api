const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/protect");
const { register, login, logout, getProfile, updateProfile } = require("../controllers/authController");

const router = express.Router();

router.post("/register", asyncHandler(register));
router.post("/login", asyncHandler(login));
router.post("/logout", protect, asyncHandler(logout));
router.get("/profile", protect, asyncHandler(getProfile));
router.put("/profile", protect, asyncHandler(updateProfile));

module.exports = router;
