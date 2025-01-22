const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { v4: uuid4 } = require("uuid");
const jwt = require("jsonwebtoken");

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

const loginUser = async ({ email, password }) => {
  const userExist = await User.findOne({ email });
  if (!userExist) {
    throw new Error("User not found");
  }
  const isPassValid = await bcrypt.compare(password, userExist.password);
  if (!isPassValid) {
    throw new Error("Invalid password");
  }

  const token = jwt.sign(
    {
      user_id: userExist.user_id,
      email: userExist.email,
      password: userExist.password,
    },
    process.env.SECRET_KEY,
    {expiresIn: "12h"}
  );
  return token;
};

module.exports = { getUser, createUser, loginUser };
