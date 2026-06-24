const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const {
  getSeoPage,
  getAllSeoPages,
  updateSeoPage,
  deleteSeoPage,
  getSitemap,
  getRobotsTxt,
  updateRobotsTxt
} = require("../controllers/seoController");

const router = express.Router();

// Public routes for generating assets
router.get("/sitemap.xml", getSitemap);
router.get("/robots.txt", getRobotsTxt);

// Get SEO data for specific page
router.get("/page/:type/:slug", getSeoPage);

// Admin routes
router.get("/pages", requireAuth, requireRole(["admin"]), getAllSeoPages);
router.put("/page/:type/:slug", requireAuth, requireRole(["admin"]), updateSeoPage);
router.delete("/page/:id", requireAuth, requireRole(["admin"]), deleteSeoPage);
router.put("/robots", requireAuth, requireRole(["admin"]), updateRobotsTxt);

module.exports = router;
