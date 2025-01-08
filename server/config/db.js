const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {});
    console.log("Connected to mongoDB");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectToDB;
