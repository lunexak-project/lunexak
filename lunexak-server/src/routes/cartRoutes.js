const express = require("express");
const { requireAuth } = require("../middleware/authMiddleware");
const {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart
} = require("../controllers/cartController");

const router = express.Router();

router.use(requireAuth);

router.get("/", getCart);
router.post("/items", addItemToCart);
router.put("/items/:id", updateItemQuantity);
router.delete("/items/:id", removeItemFromCart);
router.delete("/", clearCart);

module.exports = router;
