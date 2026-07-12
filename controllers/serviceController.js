const Service = require("../models/Service");
const User = require("../models/User");
const { isValidObjectId, validateServiceInput, getUserRefFromBody } = require("../utils/validators");

const userPopulateFields = "name email role location rating profileImage skills portfolio";

const userExists = async (userId) => {
  if (!isValidObjectId(userId)) return false;
  return Boolean(await User.findById(userId));
};

const getServices = async (req, res) => {
  const services = await Service.find()
    .populate("user", userPopulateFields)
    .sort({ legacyId: 1 });

  res.json({ success: true, count: services.length, data: services });
};

const getServiceById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid service ID." });
  }

  const service = await Service.findById(id).populate("user", userPopulateFields);
  if (!service) {
    return res.status(404).json({ success: false, error: "Service not found" });
  }

  res.json({ success: true, data: service });
};

const createService = async (req, res) => {
  const body = req.body || {};
  const validationError = validateServiceInput(body);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const userRef = getUserRefFromBody(body);
  if (!(await userExists(userRef))) {
    return res.status(400).json({ success: false, error: "User not found." });
  }

  const newService = await Service.create({
    title: body.title,
    description: body.description,
    price: Number(body.price),
    category: body.category,
    providerName: body.providerName,
    rating: body.rating !== undefined ? Number(body.rating) : 0,
    location: body.location,
    availability: body.availability !== undefined ? Boolean(body.availability) : true,
    user: userRef
  });

  await newService.populate("user", userPopulateFields);

  res.status(201).json({ success: true, message: "Service added successfully", data: newService });
};

const updateService = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid service ID." });
  }

  const service = await Service.findById(id);
  if (!service) {
    return res.status(404).json({ success: false, error: "Service not found" });
  }

  const validationError = validateServiceInput(req.body || {}, true);
  if (validationError) {
    return res.status(400).json({ success: false, error: validationError });
  }

  const userRef = getUserRefFromBody(req.body || {});
  if (userRef !== undefined && !(await userExists(userRef))) {
    return res.status(400).json({ success: false, error: "User not found." });
  }

  const { title, description, price, category, providerName, rating, location, availability } = req.body || {};

  if (title !== undefined) service.title = title;
  if (description !== undefined) service.description = description;
  if (price !== undefined) service.price = Number(price);
  if (category !== undefined) service.category = category;
  if (providerName !== undefined) service.providerName = providerName;
  if (rating !== undefined) service.rating = Number(rating);
  if (location !== undefined) service.location = location;
  if (availability !== undefined) service.availability = Boolean(availability);
  if (userRef !== undefined) service.user = userRef;

  await service.save();
  await service.populate("user", userPopulateFields);

  res.json({ success: true, message: "Service updated successfully", data: service });
};

const deleteService = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid service ID." });
  }

  const deletedService = await Service.findByIdAndDelete(id);
  if (!deletedService) {
    return res.status(404).json({ success: false, error: "Service not found" });
  }

  res.json({ success: true, message: "Service deleted successfully", data: deletedService });
};

const searchServices = async (req, res) => {
  const { title, category, location, price, providerName } = req.query;
  const filter = {};

  if (title) filter.title = { $regex: String(title), $options: "i" };
  if (category) filter.category = { $regex: new RegExp(`^${String(category)}$`, "i") };
  if (location) filter.location = { $regex: new RegExp(`^${String(location)}$`, "i") };
  if (price) filter.price = { $lte: Number(price) };
  if (providerName) filter.providerName = { $regex: new RegExp(`^${String(providerName)}$`, "i") };

  const services = await Service.find(filter)
    .populate("user", userPopulateFields)
    .sort({ legacyId: 1 });

  res.json({ success: true, count: services.length, data: services });
};

module.exports = {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices
};
