const jwt = require("jsonwebtoken");
const User = require("../models/User");
require("dotenv").config();

const generateAccessToken = (userExist) => {
  return jwt.sign(
    {
      user_id: userExist.user_id,
      email: userExist.email,
      user_privateID: userExist._id,
      type: "access",
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    { expiresIn: "15m" }
  );
};

const generateRefreshToken = (userExist) => {
  const refreshToken = jwt.sign(
    {
      user_id: userExist.user_id,
      type: "refresh",
    },
    process.env.REFRESH_TOKEN_SECRET_KEY,
    { expiresIn: "7d" }
  );
  const cookiesOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
  return { refreshToken, cookiesOptions };
};

const verifyRefreshToken = async (refreshToken) => {
  try {
    // token validation
    const decodedUser = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
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
      user: {
        user_id: decodedUser.user_id,
        email: decodedUser.email,
      },
    };
  } catch (err) {
    throw new Error(err.message);
  }
};

const refreshAccessToken = async ({ refreshToken }) => {
  try {
    const newAccToken = await verifyRefreshToken(refreshToken);
    return newAccToken;
  } catch (err) {
    throw new Error("Could not generate access token");
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  refreshAccessToken,
};
