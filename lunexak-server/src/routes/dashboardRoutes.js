const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const router = express.Router();

router.get("/", requireAuth, requireRole(["ADMIN"]), getDashboardStats);

module.exports = router;