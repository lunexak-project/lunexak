const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  verifyEmail,
  googleLogin,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh", refreshTokenHandler);
router.post("/verify-email", verifyEmail);
router.post("/google", googleLogin);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

module.exports = router;
