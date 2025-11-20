const User = require("../models/User");

const registerUser = async (userData) => {
  const { username, email, password, deviceId } = userData;
  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new Error("User already exists");
  }

  const user = await User.create({
    username,
    email,
    password,
    deviceId,
  });

  if (user) {
    return {
      _id: user.id,
      username: user.username,
      email: user.email,
      deviceId: user.deviceId,
    };
  } else {
    throw new Error("Invalid user data");
  }
};

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
  registerUser,
  getUserByEmail,
};
