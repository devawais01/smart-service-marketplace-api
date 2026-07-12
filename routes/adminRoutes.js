const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");
const { getAllUsers, deleteUser, getAllServices, deleteService } = require("../controllers/adminController");

const router = express.Router();

router.use(protect, adminOnly);

router.get("/users", asyncHandler(getAllUsers));
router.delete("/users/:id", asyncHandler(deleteUser));
router.get("/services", asyncHandler(getAllServices));
router.delete("/services/:id", asyncHandler(deleteService));

module.exports = router;
