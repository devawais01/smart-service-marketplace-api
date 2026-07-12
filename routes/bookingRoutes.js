const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/protect");
const adminOnly = require("../middleware/adminOnly");
const {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
} = require("../controllers/bookingController");

const router = express.Router();

router.use(protect);

router.post("/", asyncHandler(createBooking));
router.get("/", asyncHandler(getBookings));
router.get("/:id", asyncHandler(getBookingById));
router.put("/:id/status", asyncHandler(updateBookingStatus));
router.delete("/:id", asyncHandler(deleteBooking));

module.exports = router;
