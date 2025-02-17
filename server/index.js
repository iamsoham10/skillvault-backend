const express = require("express");
const connectToDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const helmet = require('helmet');
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const errorHandler = require("./middlewares/errorHandler");
const tokenValidator = require("./middlewares/tokenValidator");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(helmet());
app.use(express.json());

connectToDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

// user routes
app.use("/api/user", userRoutes);
// middleware to validate token
app.use("/api/auth", tokenValidator, userRoutes);

// resource routes
app.use("/api/resource", tokenValidator, resourceRoutes);

// collection routes
app.use("/api/collection", tokenValidator, collectionRoutes);

// Use error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT} 🎉`);
});
