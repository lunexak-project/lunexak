const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const {
  getBanners,
  getActiveBanners,
  createBanner,
  updateBanner,
  deleteBanner
} = require("../controllers/bannerController");

const router = express.Router();

router.get("/", getActiveBanners);
router.get("/admin/all", requireAuth, requireRole(["admin"]), getBanners);

router.post("/", requireAuth, requireRole(["admin"]), createBanner);
router.put("/:id", requireAuth, requireRole(["admin"]), updateBanner);
router.delete("/:id", requireAuth, requireRole(["admin"]), deleteBanner);

module.exports = router;
