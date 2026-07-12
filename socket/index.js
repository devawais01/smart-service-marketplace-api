const Message = require("../models/Message");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/env");

const initSocket = (io) => {
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication required"));

      const decoded = jwt.verify(token, jwtSecret);
      const user = await User.findById(decoded.id).select("-password");
      if (!user) return next(new Error("User not found"));

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.user.name} (${socket.user._id})`);

    // Join personal room for receiving messages
    socket.join(String(socket.user._id));

    // Join chat room with another user
    socket.on("join_chat", ({ partnerId }) => {
      const roomId = [String(socket.user._id), String(partnerId)].sort().join("_");
      socket.join(roomId);
      socket.emit("joined_chat", { roomId, partnerId });
    });

    // Send message via socket
    socket.on("send_message", async ({ receiver, message }) => {
      try {
        if (!receiver || !message) return;

        const saved = await Message.create({
          sender: socket.user._id,
          receiver,
          message: String(message).trim(),
          timestamp: new Date()
        });

        const populated = await saved.populate([
          { path: "sender", select: "name email role profileImage" },
          { path: "receiver", select: "name email role profileImage" }
        ]);

        const roomId = [String(socket.user._id), String(receiver)].sort().join("_");

        io.to(roomId).emit("receive_message", populated);
        io.to(String(receiver)).emit("receive_message", populated);
      } catch (error) {
        socket.emit("error_message", { error: error.message });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.user.name}`);
    });
  });
};

module.exports = initSocket;
