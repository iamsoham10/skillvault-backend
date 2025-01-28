const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // max 100 requests per 15 minutes window
  message:
    "Too many authentication requests. Please try again after 15 minutes",
});

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  max: 3, // max 3 requests per 5 minutes window
  message: "Too many OTP requests. Please try again after 5 minutes",
});

module.exports = { authLimiter, otpLimiter };
