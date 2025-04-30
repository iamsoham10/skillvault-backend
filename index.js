const express = require("express");
const connectToDB = require("./config/db");
const cors = require("cors");
require("dotenv").config();
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const errorHandler = require("./middlewares/errorHandler");
const tokenValidator = require("./middlewares/tokenValidator");
const recommendationRoutes = require("./services/recommendationService");

const app = express();
app.use(cookieParser());
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  "http://localhost:4200",
  "https://skillvault-six.vercel.app",
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
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

// recommendation routes
app.use("/api/recommend", recommendationRoutes);

// Use error handler middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT} 🎉`);
});
