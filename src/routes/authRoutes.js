const express = require("express");
const { register, login, getProfile, addAdmin } = require("../controllers/authController");
const validateRequest = require("../middleware/validateRequest");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { registerValidator, loginValidator } = require("../validators/authValidators");

const router = express.Router();

router.post("/register", registerValidator, validateRequest, register);
router.post("/login", loginValidator, validateRequest, login);
router.get("/me", protect, getProfile);
router.post("/admin/register", registerValidator, validateRequest, addAdmin);

module.exports = router;
