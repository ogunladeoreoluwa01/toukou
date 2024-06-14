const mongoose = require("mongoose");

// Define the OTP schema
const OTPSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    OTP: { type: String, required: true },
    OTPExpireDate: { type: Date, required: true },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

// Add indexing for better performance on queries
OTPSchema.index({ userId: 1 });
// Create the OTP model
const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
