const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuid4 } = require("uuid");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../services/tokenService");

const getUser = async (user_id) => {
  const user = await User.findOne({ user_id: user_id });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};

const createUser = async ({ username, email, password }) => {
  const userExist = await User.findOne({ email }).select("user_id");
  if (userExist) {
    throw new Error("User already exists");
  }
  // take the email from request body and send to user validation service //
  // in the user validation service take the email as a parameter
  // in the user validation generate a random 4/6 digit otp //
  // make sure the same otp is not generated twice //
  // store the otp in the database //
  // send an email to the email id of user, containing the otp
  // make sure the email doesn't go to span folder
  // make the otp valid only for 2 minutes
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
  await newUser.save();
  return newUser;
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

module.exports = { getUser, createUser, loginUser };
