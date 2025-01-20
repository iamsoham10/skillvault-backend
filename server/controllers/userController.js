const userService = require("../services/userService");
const asyncHandler = require("express-async-handler");

const getUserController = asyncHandler(async (req, res) => {
  const { user_id } = req.params;
  const userData = await userService.getUser(user_id);
  res.status(200).json({ success: true, data: userData });
});

const createUserController = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  await userService.createUser({ username, email, password });
  res.status(201).json({ success: true, message: "User created successfully" });
});

module.exports = { getUserController, createUserController };
