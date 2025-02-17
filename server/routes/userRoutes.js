const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/userController");
const inputValidator = require("../middlewares/inputValidator");
const { authLimiter, otpLimiter, registerLimiter } = require("../middlewares/rateLimiter");

router.get("/user/:user_id", inputValidator.checkParam, authControllers.getUserController);
router.post("/register", registerLimiter, inputValidator.checkInput, authControllers.createUserController);
router.post("/login", authLimiter, inputValidator.checkLoginInput, authControllers.loginUserController);
router.post("/refresh-token", authControllers.refreshTokenController);
router.post('/verify-otp', otpLimiter, authControllers.otpVerificationController);
router.put("/user/:id");
router.delete("/user/:id");

module.exports = router;
