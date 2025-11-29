const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { protect } = require("../middleware/authMiddleware");

router.get("/profile", protect, UserController.getUserProfile);

module.exports = router;
