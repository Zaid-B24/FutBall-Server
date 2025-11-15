const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({
    message: "API is up and running!",
  });
});

router.post("/friends", (req, res) => {
  const messageFromClient = req.body;
  console.log("Received string from client:", messageFromClient);
  res.status(200).send(messageFromClient);
});

module.exports = router;
