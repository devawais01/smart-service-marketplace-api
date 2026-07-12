const Payment = require("../models/Payment");
const Service = require("../models/Service");
const { isValidObjectId, PAYMENT_STATUSES } = require("../utils/validators");

const populateFields = [
  { path: "user", select: "name email role" },
  { path: "service", select: "title price category" }
];

const createPayment = async (req, res) => {
  const { service: serviceId, amount } = req.body || {};

  if (!serviceId || !isValidObjectId(serviceId)) {
    return res.status(400).json({ success: false, error: "Valid service ID is required." });
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ success: false, error: "Service not found." });
  }

  const payment = await Payment.create({
    user: req.user._id,
    service: serviceId,
    amount: amount !== undefined ? Number(amount) : service.price,
    status: "Pending"
  });

  await payment.populate(populateFields);

  res.status(201).json({
    success: true,
    message: "Payment created (simulation). Use /api/payments/:id/pay to complete.",
    data: payment
  });
};

const getPayments = async (req, res) => {
  const filter = req.user.role === "admin" ? {} : { user: req.user._id };
  const payments = await Payment.find(filter).populate(populateFields).sort({ createdAt: -1 });
  res.json({ success: true, count: payments.length, data: payments });
};

const getPaymentById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid payment ID." });
  }

  const payment = await Payment.findById(id).populate(populateFields);
  if (!payment) {
    return res.status(404).json({ success: false, error: "Payment not found." });
  }

  if (req.user.role !== "admin" && String(payment.user._id) !== String(req.user._id)) {
    return res.status(403).json({ success: false, error: "Not allowed." });
  }

  res.json({ success: true, data: payment });
};

const simulatePay = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid payment ID." });
  }

  const payment = await Payment.findById(id);
  if (!payment) {
    return res.status(404).json({ success: false, error: "Payment not found." });
  }

  if (String(payment.user) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Not allowed." });
  }

  if (payment.status === "Paid") {
    return res.status(400).json({ success: false, error: "Payment already completed." });
  }

  // Fake wallet / sandbox simulation — no real money
  payment.status = "Paid";
  await payment.save();
  await payment.populate(populateFields);

  res.json({
    success: true,
    message: "Payment simulated successfully (fake wallet). No real transaction occurred.",
    data: payment
  });
};

const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body || {};

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid payment ID." });
  }

  if (!PAYMENT_STATUSES.includes(status)) {
    return res.status(400).json({ success: false, error: `Status must be: ${PAYMENT_STATUSES.join(" or ")}` });
  }

  const payment = await Payment.findById(id);
  if (!payment) {
    return res.status(404).json({ success: false, error: "Payment not found." });
  }

  payment.status = status;
  await payment.save();
  await payment.populate(populateFields);

  res.json({ success: true, message: "Payment status updated", data: payment });
};

module.exports = {
  createPayment,
  getPayments,
  getPaymentById,
  simulatePay,
  updatePaymentStatus
};
