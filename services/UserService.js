const User = require("../models/User");

const getUserByEmail = async (email) => {
  const user = await User.findOne({ email });
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
  getUserByEmail,
};
