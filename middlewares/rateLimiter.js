const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    "Too many authentication requests. Please try again after 15 minutes",
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 30,
  message: "Too many OTP requests. Please try again after 5 minutes",
});

const registerLimiter = rateLimit({
  windowMS: 10 * 60 * 1000,
  max: 20,
  message: "Too many registration requests. Please try again after 10 minutes",
});

const searchLimiter = rateLimit({
  windowMS: 10 * 60 * 1000,
  max: 50,
  message: "Too many search requests. Please try again after 10 minutes",
});

module.exports = { authLimiter, otpLimiter, registerLimiter, searchLimiter };
