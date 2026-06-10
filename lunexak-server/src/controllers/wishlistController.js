const Wishlist = require("../models/Wishlist");

// Get user wishlist
const getWishlist = async (req, res) => {
  try {
    const wishlist = await Wishlist.find({ userId: req.user._id }).populate("productId");
    res.status(200).json({ success: true, count: wishlist.length, wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const existing = await Wishlist.findOne({ userId: req.user._id, productId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Already in wishlist" });
    }

    const wishlistItem = await Wishlist.create({ userId: req.user._id, productId });
    res.status(201).json({ success: true, wishlistItem });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const wishlistItem = await Wishlist.findById(req.params.id);
    if (!wishlistItem) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    if (wishlistItem.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await wishlistItem.deleteOne();
    res.status(200).json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};
