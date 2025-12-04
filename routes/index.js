const express = require("express");
const router = express.Router();

const authRoutes = require("./AuthRoutes");
const userRoutes = require("./UserRoute");
const playRoutes = require("./PlayRoutes");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API v1 is up and running!",
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/play", playRoutes);

module.exports = router;
