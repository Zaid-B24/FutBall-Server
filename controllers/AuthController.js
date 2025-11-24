const AuthService = require("../services/AuthService");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, deviceId } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userResult = await AuthService.registerUser({
      username,
      email,
      password,
      deviceId,
    });

    res.status(201).json({
      status: "success",
      data: userResult,
    });
  } catch (error) {
    if (error.message === "User already exists") {
      return res.status(400).json({ message: "User already exists" });
    }

    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "Username or Email already taken" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    const userResult = await AuthService.loginUser(email, password);
    res.status(200).json({
      status: "success",
      data: userResult,
    });
  } catch (error) {
    if (
      error.message === "User not found" ||
      error.message === "Invalid credentials"
    ) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
