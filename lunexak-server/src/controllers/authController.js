const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { generateAccessToken, generateRefreshToken } = require("../utils/generateTokens");
const { OAuth2Client } = require('google-auth-library');

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'mock_client_id_for_dev');

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      role: "customer",
      isVerified: true, // Auto-verify — email verification not implemented yet
    });

    res.status(201).json({
      success: true,
      message: "User registered. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid Email" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid Password" });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is inactive" });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      success: true,
      message: "Login Successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const logoutUser = (req, res) => {
  res.clearCookie("refreshToken");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};

const refreshTokenHandler = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "fallback_refresh_secret");
    const user = await User.findById(decoded.id);

    if (!user || !user.isActive) {
      return res.status(401).json({ success: false, message: "Invalid token or inactive user" });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    res.status(200).json({ success: true, accessToken });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid refresh token" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email } = req.body;
    // Basic simulation of email verification since we don't have token logic yet
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    user.isVerified = true;
    await user.save();
    res.status(200).json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const { token, isMock } = req.body;
    let payload;

    if (isMock) {
      // Temporary mock flow for development
      payload = {
        email: "google.user@example.com",
        name: "Google Test User",
        email_verified: true
      };
    } else {
      const ticket = await client.verifyIdToken({
          idToken: token,
          audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    }

    const { email, name, email_verified } = payload;

    if (!email_verified && !isMock) {
      return res.status(401).json({ success: false, message: "Google email not verified." });
    }

    let user = await User.findOne({ email });

    if (!user) {
      // Auto-register
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const passwordHash = await bcrypt.hash(randomPassword, 10);
      user = await User.create({
        name,
        email,
        passwordHash,
        role: "customer",
        isVerified: true,
      });
    }

    if (!user.isActive) {
      return res.status(403).json({ success: false, message: "Account is inactive" });
    }

    const accessToken = generateAccessToken(user._id, user.role);
    const refreshToken = generateRefreshToken(user._id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Google Login Successful",
      accessToken,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const emailService = require("../services/emailService");
const crypto = require("crypto");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    await emailService.sendPasswordReset(user, resetToken);

    res.status(200).json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired token" });
    }

    user.passwordHash = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: "Password reset successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  refreshTokenHandler,
  verifyEmail,
  googleLogin,
  forgotPassword,
  resetPassword
};