const mongoose = require("mongoose");
require("dotenv").config();

const connectToDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URI, {});
    console.log("Connected to mongoDB");
  } catch (err) {
    res.sendStatus(500).json({ error: "Can't connect to mongoDB" });
  }
};

module.exports = connectToDB;
