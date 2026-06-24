const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const {
  createCategory,
  getCategories,
  getSingleCategory,
  updateCategory,
  deleteCategory,
  updateCategoryStatus,
  updateCategoryFeatured
} = require("../controllers/categoryController");

const router = express.Router();

router.post("/", requireAuth, requireRole(["admin"]), createCategory);
router.get("/", getCategories);
router.get("/:slug", getSingleCategory);
router.put("/:id", requireAuth, requireRole(["admin"]), updateCategory);
router.delete("/:id", requireAuth, requireRole(["admin"]), deleteCategory);
router.patch("/:id/status", requireAuth, requireRole(["admin"]), updateCategoryStatus);
router.patch("/:id/featured", requireAuth, requireRole(["admin"]), updateCategoryFeatured);

module.exports = router;
