const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

router.get("/profile", UserController.getUserProfile);

module.exports = router;
