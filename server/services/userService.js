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
  const userExist = await User.findOne({ email });
  if (userExist) {
    throw new Error("User already exists");
  }
  const saltValue = 11;
  const finalHashedPassword = await bcrypt.hash(password, saltValue);
  const newUser = new User({
    username,
    email,
    password: finalHashedPassword,
    user_id: uuid4(),
  });
  await newUser.save();
  return newUser;
};

module.exports = { getUser, createUser };
