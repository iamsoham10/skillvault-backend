const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      ref: "User",
      required: true,
      unique: true,
      index: true
    },
    profilePicture: {
      type: String,
      trim: true,
      select: false
    },
    collections: [{
      type: String,
      ref: "Collection",
    }],
    refreshToken: {
      type: String,
      select: false,
    },
    lastLogin: {
      type: Date,
      select: false,
    },
    otp: {
      type: Number,
      select: false,
    }
  },
  {
    timestamps: false,
    strict: true,
  }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
