const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const { getUserNotifications, markAsRead } = require("../controllers/notificationController");

const router = express.Router();

router.get("/", requireAuth, getUserNotifications);
router.put("/:id/read", requireAuth, markAsRead);

module.exports = router;
