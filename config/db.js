const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connect = await mongoose.connect(
      process.env.MONGO_URI || "mongodb://localhost:27017/fotball"
    );
    console.log(
      `MongoDb connected successfully on : ${connect.connection.host}`
    );
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
