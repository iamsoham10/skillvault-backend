const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuid4 } = require("uuid");
const jwt = require("jsonwebtoken");
const genOTP = require("./otpService");
const sendEmail = require("./emailService");
const { generateAccessToken, generateRefreshToken } = require("../services/tokenService");

const getUser = async (user_id) => {
  const user = await User.findOne({ user_id: user_id });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const createUser = async ({ username, email, password }) => {
  try {
    const userExist = await User.findOne({ email }).select("user_id");
    if (userExist) {
      throw new Error("User already exists");
    }
    const [hashedPassword, user_id] = await Promise.all([
      bcrypt.hash(password, 10),
      uuid4(),
    ]);
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      user_id,
    });
    // save the user without otp
    await newUser.save();
    // generate and save otp
    const emailOTPUser = await genOTP.saveOTP(newUser.email);
    // take the email and otp from the db and send to email service to send email
    setImmediate(async () => {
      try {
        await sendEmail.sendOTPEmail(newUser.email, emailOTPUser);
      } catch (err) {
        console.error("Error sending email in background: ", err);
      }
    });
    return {
      OTPCode: {
        emailOTPUser,
      },
    };
  } catch (err) {
    throw new Error("User creation failed");
  }
};

const verifyOTP = async (email, otp) => {
  console.log(email, otp);
  try {
    const user = await User.findOne({ email }).select("user_id");
    if (!user) {
      throw new Error("User not found");
    }
    const userOTP = await genOTP.validateOTP(email, otp);
    if (!userOTP) {
      throw new Error("Invalid OTP");
    }
    return user;
  } catch (err) {
    throw new Error("OTP verification failed");
  }
};

const loginUser = async ({ email, password }) => {
  try {
    const userExist = await User.findOne({ email }).select(
      "+refreshToken +lastLogin"
    );
    if (!userExist) {
      throw new Error("User not found");
    }
    const isPassValid = await bcrypt.compare(password, userExist.password);
    if (!isPassValid) {
      throw new Error("Invalid password");
    }
    const accessToken = generateAccessToken(userExist);
    const refreshToken = generateRefreshToken(userExist);

    userExist.refreshToken = refreshToken;
    userExist.lastLogin = Date.now();
    await userExist.save();
    return {
      user: userExist,
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  } catch (err) {
    throw new Error("Authentication failed");
  }
};

module.exports = { getUser, createUser, verifyOTP, loginUser };
