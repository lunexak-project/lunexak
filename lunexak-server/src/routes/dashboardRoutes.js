const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", requireAuth, requireRole(["admin"]), getDashboardStats);

module.exports = router;