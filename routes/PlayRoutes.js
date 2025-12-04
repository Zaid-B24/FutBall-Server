const express = require("express");
const router = express.Router();
const PlayController = require("../controllers/PlayController");
const { protect } = require("../middleware/AuthMiddleware");

router.post("/", protect, PlayController.requestToPlay);

module.exports = router;
