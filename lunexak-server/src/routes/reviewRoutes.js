const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");
const {
  getProductReviews,
  addReview,
  updateReview,
  deleteReview,
  moderateReview
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/product/:productId", getProductReviews);

router.post("/", requireAuth, addReview);
router.put("/:id", requireAuth, updateReview);
router.delete("/:id", requireAuth, deleteReview);

// Admin moderation
router.patch("/:id/moderate", requireAuth, requireRole(["admin"]), moderateReview);

module.exports = router;
