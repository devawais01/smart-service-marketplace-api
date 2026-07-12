const Service = require("../models/Service");
const Review = require("../models/Review");

const updateServiceAverageRating = async (serviceId) => {
  const reviews = await Review.find({ service: serviceId });
  if (reviews.length === 0) return;

  const average = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  await Service.findByIdAndUpdate(serviceId, { rating: Math.round(average * 10) / 10 });
};

module.exports = { updateServiceAverageRating };
