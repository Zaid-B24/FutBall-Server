const User = require("../models/User");
const jwt = require("jsonwebtoken");

const registerUser = async (userData) => {
  const { username, email, password, deviceId } = userData;

  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    throw new Error("User already exists");
  }

  const newUser = await User.create({
    username,
    email,
    password,
    deviceId,
  });

  const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  if (newUser) {
    return {
      token,
      user: {
        _id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        deviceId: newUser.deviceId,
      },
    };
  } else {
    throw new Error("Invalid user data");
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new Error("User not found");
  }

  if (user.password !== password) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return {
    token,
    user: {
      _id: user.id,
      username: user.username,
      email: user.email,
    },
  };
};

module.exports = {
  registerUser,
  loginUser,
};
