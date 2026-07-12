const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserServices
} = require("../controllers/userController");

const router = express.Router();

router.get("/", asyncHandler(getUsers));
router.post("/", asyncHandler(createUser));
router.get("/:id/services", asyncHandler(getUserServices));
router.get("/:id", asyncHandler(getUserById));
router.put("/:id", asyncHandler(updateUser));
router.delete("/:id", asyncHandler(deleteUser));

module.exports = router;
