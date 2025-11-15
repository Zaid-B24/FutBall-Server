const express = require("express");
const apiRouter = require("./http");

const app = express();
app.use(express.json());

app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
  res.status(200).json("What are you doing here?");
});

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.statusCode = 404;
  next(err);
});

app.use((err, req, res, next) => {
  console.error("--- UNHANDLED ERROR ---", err);
  const statusCode = err.statusCode || 500;
  const message =
    statusCode === 500 && process.env.NODE_ENV === "production"
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

module.exports = app;
