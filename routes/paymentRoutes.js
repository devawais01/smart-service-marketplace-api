const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/protect");
const {
  createPayment,
  getPayments,
  getPaymentById,
  simulatePay,
  updatePaymentStatus
} = require("../controllers/paymentController");

const router = express.Router();

router.use(protect);

router.post("/", asyncHandler(createPayment));
router.get("/", asyncHandler(getPayments));
router.get("/:id", asyncHandler(getPaymentById));
router.put("/:id/pay", asyncHandler(simulatePay));
router.put("/:id/status", asyncHandler(updatePaymentStatus));

module.exports = router;
