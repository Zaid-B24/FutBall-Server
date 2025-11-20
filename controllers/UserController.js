const UserService = require("../services/UserService");

const registerUser = async (req, res) => {
  try {
    const { username, email, password, deviceId } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "Please provide all fields" });
    }

    const userResult = await UserService.registerUser({
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

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.query;
    if (!email) {
      return res
        .status(400)
        .json({ message: "Please provide an email in the query parameters" });
    }
    const userData = await UserService.getUserByEmail(email);
    res.status(200).json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    console.error("Error in GetProfile:", error.message);
    if (error.message === "User not found") {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = {
  registerUser,
  getUserProfile,
};
