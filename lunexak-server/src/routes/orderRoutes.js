const express = require("express");

const {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const router = express.Router();

// Create Order
router.post("/", createOrder);

// Get All Orders (Admin)
router.get("/", getOrders);

// Get Orders Of Specific User
router.get("/user/:userId", getMyOrders);

// Update Order Status
router.put("/:id", updateOrderStatus);

module.exports = router;