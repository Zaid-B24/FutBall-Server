const UserService = require("../services/UserService");

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const userData = await UserService.getUserProfile(userId);
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
  getUserProfile,
};
