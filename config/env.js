require("dotenv").config();

module.exports = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/service_marketplace",
  nodeEnv: process.env.NODE_ENV || "development",
  jwtSecret: process.env.JWT_SECRET || "smart_marketplace_secret_key_change_in_production",
  jwtExpire: process.env.JWT_EXPIRE || "7d"
};
