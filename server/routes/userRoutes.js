const express = require("express");
const router = express.Router();
// const { getUserController } = require("../controllers/userController");
// const { createUserController } = require("../controllers/userController");
// const { loginUserController } = require("../controllers/userController");
const {getUserController, createUserController, loginUserController} = require("../controllers/userController");

router.get("/user/:user_id", getUserController);
router.post("/newUser", createUserController);
router.post("/login", loginUserController);
router.put("/user/:id");
router.delete("/user/:id");

module.exports = router;
