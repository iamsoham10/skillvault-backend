const express = require("express");
const connectToDB = require("./config/db");
const app = express();

connectToDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(3000, () => {
  console.log("Server started on http://localhost:3000 🎉");
});
