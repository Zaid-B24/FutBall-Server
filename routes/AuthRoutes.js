const express = require("express");
const router = express.Router();
const AuthController = require("../controllers/AuthController");

router.post("/register", AuthController.registerUser);
router.post("/login", AuthController.loginUser);
// Future OAuth routes will live here cleanly:
// router.post("/google", AuthController.googleLogin);
// router.post("/apple", AuthController.appleLogin);

module.exports = router;
