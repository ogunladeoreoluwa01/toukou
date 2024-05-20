const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define the achievement schema
const achievementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  badge_url: { type: String, required: true },
});

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    superAdmin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    sex: { type: String, default: "" },
    noOfPosts: { type: Number, default: 0 },
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    banned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
    banExpiration: { type: Date, default: null },
    deleted: { type: Boolean, default: false },
    deletionReason: { type: String, default: "" },
    achievements: { type: [achievementSchema], default: [] }, // Initialize achievements array as empty
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      this.password = hashedPassword;
      return next();
    } catch (error) {
      return next(error);
    }
  }
  return next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
