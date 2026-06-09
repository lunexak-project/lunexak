const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// Create Order
router.post("/", requireAuth, createOrder);

// Get All Orders (Admin)
router.get("/", requireAuth, requireRole(["ADMIN"]), getOrders);

// Get Orders Of Specific User
router.get("/user/:userId", requireAuth, getMyOrders);

// Update Order Status
router.put("/:id", requireAuth, requireRole(["ADMIN"]), updateOrderStatus);

module.exports = router;