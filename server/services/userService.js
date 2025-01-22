const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuid4 } = require("uuid");

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

module.exports = { getUser, createUser };
