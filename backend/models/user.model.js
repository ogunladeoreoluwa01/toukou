const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // Corrected import statement for bcrypt
// Added import statement for jwt

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    admin: { type: Boolean, default: false },
    verified: { type: Boolean, default: false },
    verificationCode: { type: String, required: false },
    sex: { type: String, default: "" },
    profileImage: { type: String, default: "" },
    bio: { type: String, default: "" },
    banned: { type: Boolean, default: false },
    banReason: { type: String, default: "" },
    deleted: { type: Boolean, default: false },
    deletionReason: { type: String, default: "" },
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
