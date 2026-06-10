const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  submitProduct,
  approveProduct,
  rejectProduct,
  publishProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", requireAuth, requireRole(["admin", "employee"]), createProduct);

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

router.put("/:id", requireAuth, requireRole(["admin", "employee"]), updateProduct);

router.delete("/:id", requireAuth, requireRole(["admin"]), deleteProduct);

// PRD specific endpoints for workflow
router.post("/:id/submit", requireAuth, requireRole(["employee", "admin"]), submitProduct);
router.post("/:id/approve", requireAuth, requireRole(["admin"]), approveProduct);
router.post("/:id/reject", requireAuth, requireRole(["admin"]), rejectProduct);
router.post("/:id/publish", requireAuth, requireRole(["admin"]), publishProduct);

module.exports = router;