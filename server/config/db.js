const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {
      maxPoolSize: 5,
    });
    console.log("Connected to mongoDB");
  } catch (err) {
    console.log("error connecting to mongoDB", err);
  }
};

module.exports = connectToDB;
