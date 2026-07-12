const express = require("express");
const asyncHandler = require("../middleware/asyncHandler");
const protect = require("../middleware/protect");
const { sendMessage, getMessages, getConversation } = require("../controllers/messageController");

const router = express.Router();

router.use(protect);

router.post("/", asyncHandler(sendMessage));
router.get("/", asyncHandler(getMessages));
router.get("/conversation/:userId", asyncHandler(getConversation));

module.exports = router;
