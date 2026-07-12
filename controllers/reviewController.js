const Review = require("../models/Review");
const Service = require("../models/Service");
const { isValidObjectId } = require("../utils/validators");
const { updateServiceAverageRating } = require("../utils/ratingHelper");

const populateFields = [
  { path: "user", select: "name email role profileImage" },
  { path: "service", select: "title category providerName" }
];

const addReview = async (req, res) => {
  const { service: serviceId, rating, comment } = req.body || {};

  if (!serviceId || !isValidObjectId(serviceId)) {
    return res.status(400).json({ success: false, error: "Valid service ID is required." });
  }

  if (rating === undefined || Number(rating) < 1 || Number(rating) > 5) {
    return res.status(400).json({ success: false, error: "Rating must be between 1 and 5." });
  }

  const service = await Service.findById(serviceId);
  if (!service) {
    return res.status(404).json({ success: false, error: "Service not found." });
  }

  const review = await Review.create({
    user: req.user._id,
    service: serviceId,
    rating: Number(rating),
    comment: comment || ""
  });

  await updateServiceAverageRating(serviceId);
  await review.populate(populateFields);

  res.status(201).json({ success: true, message: "Review added", data: review });
};

const getReviews = async (req, res) => {
  const filter = {};
  if (req.query.service) filter.service = req.query.service;
  if (req.query.user) filter.user = req.query.user;

  const reviews = await Review.find(filter).populate(populateFields).sort({ createdAt: -1 });
  res.json({ success: true, count: reviews.length, data: reviews });
};

const getReviewById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid review ID." });
  }

  const review = await Review.findById(id).populate(populateFields);
  if (!review) {
    return res.status(404).json({ success: false, error: "Review not found." });
  }

  res.json({ success: true, data: review });
};

const updateReview = async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body || {};

  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid review ID." });
  }

  const review = await Review.findById(id);
  if (!review) {
    return res.status(404).json({ success: false, error: "Review not found." });
  }

  if (String(review.user) !== String(req.user._id) && req.user.role !== "admin") {
    return res.status(403).json({ success: false, error: "Not allowed to update this review." });
  }

  if (rating !== undefined) {
    if (Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({ success: false, error: "Rating must be between 1 and 5." });
    }
    review.rating = Number(rating);
  }
  if (comment !== undefined) review.comment = comment;

  await review.save();
  await updateServiceAverageRating(review.service);
  await review.populate(populateFields);

  res.json({ success: true, message: "Review updated", data: review });
};

const deleteReview = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid review ID." });
  }

  const review = await Review.findByIdAndDelete(id);
  if (!review) {
    return res.status(404).json({ success: false, error: "Review not found." });
  }

  await updateServiceAverageRating(review.service);

  res.json({ success: true, message: "Review deleted", data: review });
};

module.exports = {
  addReview,
  getReviews,
  getReviewById,
  updateReview,
  deleteReview
};
