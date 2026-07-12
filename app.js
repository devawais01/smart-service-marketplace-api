const express = require("express");
const cors = require("cors");
const serviceRoutes = require("./routes/serviceRoutes");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const messageRoutes = require("./routes/messageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

// Catch malformed JSON before it crashes the server
app.use((err, req, res, next) => {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ success: false, error: "Invalid JSON in request body." });
  }
  next(err);
});

app.get("/", (req, res) => {
  res.json({
    message: "Smart Service Marketplace API is running...",
    project: "Assignment-4 — Smart Service Marketplace",
    endpoints: {
      auth: "/api/auth",
      users: "/users",
      services: "/services",
      bookings: "/api/bookings",
      reviews: "/api/reviews",
      messages: "/api/messages",
      payments: "/api/payments",
      admin: "/api/admin"
    }
  });
});


app.use("/api/auth", authRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/admin", adminRoutes);

app.use("/services", serviceRoutes);
app.use("/users", userRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use(errorHandler);

module.exports = app;
