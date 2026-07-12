const mongoose = require("mongoose");

const ROLES = ["client", "provider", "admin"];

const ROLE_ALIASES = {
  client: "client",
  Client: "client",
  provider: "provider",
  "service provider": "provider",
  "Service Provider": "provider",
  admin: "admin",
  Admin: "admin"
};

const normalizeRole = (role) => {
  if (!role) return null;
  return ROLE_ALIASES[role] || ROLE_ALIASES[String(role).toLowerCase()] || null;
};

const isValidRole = (role) => ROLES.includes(normalizeRole(role));

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getUserRefFromBody = (body) => body.createdBy || body.user || body.userId;

const BOOKING_STATUSES = ["Pending", "Accepted", "Completed", "Cancelled"];
const PAYMENT_STATUSES = ["Pending", "Paid"];

const validateServiceInput = (data, isUpdate = false) => {
  const { title, description, price, category, providerName, rating, location } = data;
  const userRef = getUserRefFromBody(data);

  if (!isUpdate) {
    if (!title || !description || price === undefined || !category || !providerName || rating === undefined || !location || userRef === undefined) {
      return "All fields (title, description, price, category, providerName, rating, location, user/createdBy) are required.";
    }
  }

  if (rating !== undefined && (Number(rating) < 0 || Number(rating) > 5)) {
    return "Rating must be between 0 and 5.";
  }

  if (userRef !== undefined && !isValidObjectId(userRef)) {
    return "Invalid user ID.";
  }

  return null;
};

module.exports = {
  ROLES,
  normalizeRole,
  isValidRole,
  isValidObjectId,
  getUserRefFromBody,
  validateServiceInput,
  BOOKING_STATUSES,
  PAYMENT_STATUSES
};
