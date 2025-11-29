const User = require("../models/User");

const getUserProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error("User not found");
  }

  return {
    _id: user.id,
    username: user.username,
    email: user.email,
    deviceId: user.deviceId,
    playerLevel: user.playerLevel,
    friends: user.friends,
  };
};

module.exports = {
  getUserProfile,
};
