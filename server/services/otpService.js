const User = require("../models/User");

// function to generate random 4/6 digit otp
const otpGenerator = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};

const saveOTP = async (email) => {
  try {
    const userToValidate = await User.findOne({ email }).select("user_id");
    if (!userToValidate) {
      throw new Error("Invalid user");
    }
    const userOTP = otpGenerator();
    userToValidate.otp = userOTP;
    await userToValidate.save();
    return userToValidate;
  } catch (err) {
    throw new Error("OTP validation failed");
  }
};

module.exports = { saveOTP };
