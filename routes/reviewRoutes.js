const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/protect");
const {
  addReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/", asyncHandler(getReviews));
router.get("/:id", asyncHandler(getReviewById));
router.post("/", protect, asyncHandler(addReview));
router.put("/:id", protect, asyncHandler(updateReview));
router.delete("/:id", protect, asyncHandler(deleteReview));

module.exports = router;
