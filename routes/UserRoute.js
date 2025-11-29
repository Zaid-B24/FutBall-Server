const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");
const { protect } = require("../middleware/AuthMiddleware");

router.get("/profile", protect, UserController.getUserProfile);

module.exports = router;
