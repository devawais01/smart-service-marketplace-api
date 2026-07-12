const Booking = require("../models/Booking");
const Service = require("../models/Service");
const { isValidObjectId, BOOKING_STATUSES } = require("../utils/validators");

const populateFields = [
  { path: "user", select: "name email role" },
  { path: "service", select: "title price category providerName" }
];

const createBooking = async (req, res) => {
  const { service: serviceId, bookingDate } = req.body || {};

  if (!serviceId || !isValidObjectId(serviceId)) {
    return res.status(400).json({ success: false, error: "Valid service ID is required." });
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ success: false, error: "Service not found." });
  }

  const booking = await Booking.create({
    user: req.user._id,
    service: serviceId,
    bookingDate: bookingDate || Date.now(),
    status: "Pending"
  });

  await booking.populate(populateFields);

  res.status(201).json({ success: true, message: "Booking created", data: booking });
};

const getBookings = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user._id };
  const bookings = await Booking.find(filter).populate(populateFields).sort({ createdAt: -1 });
  res.json({ success: true, count: bookings.length, data: bookings });
};

const getBookingById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid booking ID." });
  }

  const booking = await Booking.findById(id).populate(populateFields);
  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking not found." });
  }

  if (req.user.role !== "admin" && String(booking.user._id) !== String(req.user._id)) {
    return res.status(403).json({ success: false, error: "Not allowed to view this booking." });
  }

  res.json({ success: true, data: booking });
};

const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid booking ID." });
  }

  if (!BOOKING_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, error: `Status must be one of: ${BOOKING_STATUSES.join(", ")}` });
  }

  const booking = await Booking.findById(id);
  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking not found." });
  }

  booking.status = status;
  await booking.save();
  await booking.populate(populateFields);

  res.json({ success: true, message: "Booking status updated", data: booking });
};

const deleteBooking = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid booking ID." });
  }

  const booking = await Booking.findByIdAndDelete(id);
  if (!booking) {
    return res.status(404).json({ success: false, error: "Booking not found." });
  }

  res.json({ success: true, message: "Booking deleted", data: booking });
};

module.exports = {
  createBooking,
  getBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking
};
