const express = require("express");
const {
  register,
  login,
  logout,
  getUserProfile,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected routes
router.get("/profile", authMiddleware, getUserProfile);
router.post("/logout", authMiddleware, logout);

module.exports = router;
