const Review = require("../models/Review");

// Get reviews for a product
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ 
      productId: req.params.productId,
      isApproved: true // Only show approved reviews by default
    }).populate("userId", "name");
    
    res.status(200).json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a review
const addReview = async (req, res) => {
  try {
    const { productId, rating, title, body } = req.body;
    
    // Check if already reviewed
    const existingReview = await Review.findOne({ productId, userId: req.user._id });
    if (existingReview) {
      return res.status(400).json({ success: false, message: "You have already reviewed this product" });
    }

    const review = await Review.create({
      userId: req.user._id,
      productId,
      rating,
      title,
      body
    });

    res.status(201).json({ success: true, message: "Review submitted and pending approval", review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update review
const updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    // Make sure it belongs to user
    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete review
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });

    if (review.userId.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(401).json({ success: false, message: "Not authorized" });
    }

    await review.deleteOne();
    res.status(200).json({ success: true, message: "Review deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Moderate review (Admin only)
const moderateReview = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const review = await Review.findByIdAndUpdate(req.params.id, { isApproved }, { new: true });
    
    if (!review) return res.status(404).json({ success: false, message: "Review not found" });
    
    // Also recalculate product rating avg here in a real scenario
    
    res.status(200).json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  moderateReview
};
