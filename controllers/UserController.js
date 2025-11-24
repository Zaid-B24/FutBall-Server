const UserService = require("../services/UserService");

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
  getUserProfile,
};
