const jwt = require("jsonwebtoken");
const User = require("../models/User");
const expressAsyncHandler = require("express-async-handler");
require("dotenv").config();

const generateAccessToken = (userExist) => {
  return jwt.sign(
    {
      user_id: userExist.user_id,
      email: userExist.email,
      type: "access",
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (userExist) => {
  return jwt.sign(
    {
      user_id: userExist.user_id,
      type: "refresh",
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  );
};

const verifyRefreshToken = async (refreshToken) => {
  try {
    // token validation
    const decodedUser = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET_KEY);
    if (decodedUser.type !== "refresh") {
      throw new Error("Invalid token type");
    }
    const user = await User.findOne({
      user_id: decodedUser.user_id,
      // email: decodedUser.email,
      refreshToken: refreshToken,
    });
    if (!user) {
      throw new Error("Invalid refresh token");
    }
    newAccessToken = generateAccessToken(user);
    return {
      accessToken: newAccessToken,
      user:{
        user_id: decodedUser.user_id,
        email: decodedUser.email
      }
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const refreshAccessToken = async ({refreshToken}) => {
  try{
    const newAccToken = await verifyRefreshToken(refreshToken);
    return newAccToken;
  } catch(err){
    throw new Error('Could not generate access token');
  }
}

module.exports = { generateAccessToken, generateRefreshToken, refreshAccessToken };
