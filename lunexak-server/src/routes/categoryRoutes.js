const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

// const {
//   createCategory,
//   getCategories,
//   getSingleCategory,
//   updateCategory,
//   deleteCategory,
// } = require("../controllers/categoryController");

const router = express.Router();

// Mock endpoints for now until categoryController is implemented
router.post("/", requireAuth, requireRole(["admin"]), (req, res) => res.json({ success: true, message: "Category created" }));
router.get("/", (req, res) => res.json({ success: true, message: "List categories" }));
router.get("/:slug", (req, res) => res.json({ success: true, message: "Single category" }));
router.put("/:id", requireAuth, requireRole(["admin"]), (req, res) => res.json({ success: true, message: "Category updated" }));
router.delete("/:id", requireAuth, requireRole(["admin"]), (req, res) => res.json({ success: true, message: "Category deleted" }));

module.exports = router;
