const User = require("../models/User");
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
  const newUser = new User({
    username,
    email,
    password,
    user_id: uuid4(),
  });
  await newUser.save();
  return newUser;
};

module.exports = { getUser, createUser };
