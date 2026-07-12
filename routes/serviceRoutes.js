const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const {
  getServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  searchServices
} = require("../controllers/serviceController");

const router = express.Router();

// Search must be before /:id
router.get("/search", asyncHandler(searchServices));
router.get("/", asyncHandler(getServices));
router.post("/", asyncHandler(createService));
router.get("/:id", asyncHandler(getServiceById));
router.put("/:id", asyncHandler(updateService));
router.delete("/:id", asyncHandler(deleteService));

module.exports = router;
