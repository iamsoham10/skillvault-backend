const express = require("express");
const router = express.Router();
const authControllers = require("../controllers/userController");
const inputValidator = require("../middlewares/inputValidator");
const { authLimiter, otpLimiter, registerLimiter } = require("../middlewares/rateLimiter");
const { upload, uploadToCloudinary } = require("../services/imageUploadService");

router.get("/user/:user_id", inputValidator.checkParam, authControllers.getUserController);
router.post("/register", registerLimiter, inputValidator.checkInput, authControllers.createUserController);
router.post("/login", authLimiter, inputValidator.checkLoginInput, authControllers.loginUserController);
router.post("/refresh-token", authControllers.refreshTokenController);
router.post('/verify-otp', otpLimiter, authControllers.otpVerificationController);
router.post('/upload-image', upload.single('imageFile'), authControllers.imageUploadController);

module.exports = router;
