const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const emailService = require("../services/emailService");

const createOrder = async (req, res) => {
  try {
    const orderData = { ...req.body, user: req.user.id };
    const order = await Order.create(orderData);

    // 1. Deduct stock
    if (order.items && order.items.length > 0) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity }
        });
      }
    }

    // 2. Clear Cart
    await Cart.findOneAndUpdate({ userId: req.user.id }, { items: [] });

    // 3. Send Order Confirmation Email
    // Populate user to get email and name (since order.user only has ID currently, but req.user has it)
    await emailService.sendOrderConfirmation(req.user, order);

    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order Not Found",
      });
    }

    order.status = req.body.status;
    await order.save();

    // Send email on status change
    await emailService.sendOrderStatusUpdate(order.user, order);

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
};