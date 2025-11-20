const express = require("express");
const router = express.Router();

const userRoutes = require("./UserRoute");

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API v1 is up and running!",
  });
});

router.use("/users", userRoutes);

module.exports = router;
