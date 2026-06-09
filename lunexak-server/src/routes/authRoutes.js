const express = require("express");
const {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  verifyEmail,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.post("/refresh-token", refreshTokenHandler);
router.post("/verify-email", verifyEmail);

module.exports = router;
