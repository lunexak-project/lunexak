const express = require("express");
const { requireAuth, requireRole } = require("../middleware/authMiddleware");

const {
  createProduct,
  getProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const router = express.Router();

router.post("/", requireAuth, requireRole(["ADMIN", "EMPLOYEE"]), createProduct);

router.get("/", getProducts);

router.get("/:id", getSingleProduct);

router.put("/:id", requireAuth, requireRole(["ADMIN"]), updateProduct);

router.delete("/:id", requireAuth, requireRole(["ADMIN"]), deleteProduct);

// PRD specific endpoints for workflow
// router.post("/:id/submit", requireAuth, requireRole(["EMPLOYEE"]), submitProduct);
// router.post("/:id/approve", requireAuth, requireRole(["ADMIN"]), approveProduct);
// router.post("/:id/publish", requireAuth, requireRole(["ADMIN"]), publishProduct);

module.exports = router;