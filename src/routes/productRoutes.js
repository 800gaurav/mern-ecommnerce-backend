const express = require("express");
const {
  getProducts,
  getProductById,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validateRequest = require("../middleware/validateRequest");
const upload = require("../middleware/uploadMiddleware");
const {
  createProductValidator,
  updateProductValidator,
  productIdParamValidator,
} = require("../validators/productValidators");

const router = express.Router();

router.get("/", getProducts);
router.get("/admin/list", protect, authorize("admin"), getAdminProducts);
router.get("/:id", productIdParamValidator, validateRequest, getProductById);

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  createProduct
);
router.put(
  "/:id",
  protect,
  authorize("admin"),
  productIdParamValidator,
  upload.array("images", 5),
  updateProduct
);
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  productIdParamValidator,
  validateRequest,
  deleteProduct
);

module.exports = router;
