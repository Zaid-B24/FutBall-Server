const { default: mongoose } = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    //Autho
    deviceId: {
      type: String,
      unique: true,
      required: [true, "Device id is required"],
    },
    username: {
      type: String,
      required: [true, "Please add a username"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please add a valid email",
      ],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      select: false,
    },

    //data
    playerLevel: {
      type: Number,
      default: 1,
    },
    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
