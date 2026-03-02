const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  getAllUsers,
  toggleBlockUser,
  deleteUser,
  getAllOrders,
  updateOrderStatus,
} = require("../controllers/adminController");

const router = express.Router();

// User management
router.get("/users", protect, adminOnly, getAllUsers);
router.patch("/users/:id/toggle-block", protect, adminOnly, toggleBlockUser);
router.delete("/users/:id", protect, adminOnly, deleteUser);

// Order management
router.get("/orders", protect, adminOnly, getAllOrders);
router.patch("/orders/:id/status", protect, adminOnly, updateOrderStatus);

module.exports = router;
