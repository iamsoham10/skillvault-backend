const express = require("express");
const router = express.Router();
// const { getUserController } = require("../controllers/userController");
// const { createUserController } = require("../controllers/userController");
// const { loginUserController } = require("../controllers/userController");
const authControllers = require("../controllers/userController");

router.get("/user/:user_id", authControllers.getUserController);
router.post("/register", authControllers.createUserController);
router.post("/login", authControllers.loginUserController);
router.post("/refresh-token", authControllers.refreshTokenController);
router.put("/user/:id");
router.delete("/user/:id");

module.exports = router;
