require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const User = require("./models/User");

const testDatabase = async () => {
  try {
    // 1. Connect
    await connectDB();

    // 2. Create a Fake User
    const testUser = new User({
      username: "TestPlayer_" + Math.floor(Math.random() * 1000),
      email: `test${Math.floor(Math.random() * 1000)}@example.com`,
      password: "supersecretpassword", // In real app, we hash this!
      deviceId: "device_id_" + Math.floor(Math.random() * 1000),
    });

    // 3. Save to MongoDB
    console.log("⏳ Saving user...");
    const savedUser = await testUser.save();

    console.log("🎉 SUCCESS! User saved to database:");
    console.log(savedUser);

    // 4. Clean up (Disconnect)
    await mongoose.connection.close();
    console.log("🔌 Disconnected.");
    process.exit(0);
  } catch (error) {
    console.error("❌ TEST FAILED:", error.message);
    process.exit(1);
  }
};

testDatabase();
