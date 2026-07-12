const Message = require("../models/Message");
const User = require("../models/User");
const { isValidObjectId } = require("../utils/validators");

const populateFields = [
  { path: "sender", select: "name email role profileImage" },
  { path: "receiver", select: "name email role profileImage" }
];

const sendMessage = async (req, res) => {
  const { receiver, message } = req.body || {};

  if (!receiver || !isValidObjectId(receiver)) {
    return res.status(400).json({ success: false, error: "Valid receiver ID is required." });
  }

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: "Message text is required." });
  }

  const receiverUser = await User.findById(receiver);
  if (!receiverUser) {
    return res.status(404).json({ success: false, error: "Receiver not found." });
  }

  const newMessage = await Message.create({
    sender: req.user._id,
    receiver,
    message: message.trim(),
    timestamp: new Date()
  });

  await newMessage.populate(populateFields);

  res.status(201).json({ success: true, message: "Message sent", data: newMessage });
};

const getMessages = async (req, res) => {
  const messages = await Message.find({
    $or: [{ sender: req.user._id }, { receiver: req.user._id }]
  })
    .populate(populateFields)
    .sort({ timestamp: 1 });

  res.json({ success: true, count: messages.length, data: messages });
};

const getConversation = async (req, res) => {
  const { userId } = req.params;

  if (!isValidObjectId(userId)) {
    return res.status(400).json({ success: false, error: "Invalid user ID." });
  }

  const messages = await Message.find({
    $or: [
      { sender: req.user._id, receiver: userId },
      { sender: userId, receiver: req.user._id }
    ]
  })
    .populate(populateFields)
    .sort({ timestamp: 1 });

  res.json({ success: true, count: messages.length, data: messages });
};

module.exports = { sendMessage, getMessages, getConversation };
