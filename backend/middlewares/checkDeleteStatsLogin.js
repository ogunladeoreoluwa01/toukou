const User = require("../models/user.model");

const checkSoftDeletedLogin = async (req, res, next) => {
  try {
    const { userInfo } = req.body;

    // Check if req.user is set by your authentication middleware
    if (!userInfo) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Find the user by username or email
    const user = await User.findOne({
      $or: [{ username: userInfo }, { email: userInfo }],
    });

    // If user not found, return appropriate response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user account is soft deleted
    if (user.deleted) {
      let deleteMessage = "Your account has been soft deleted";

      if (user.deletionReason) {
        deleteMessage += `. Reason: ${user.deletionReason}`;
      }

      return res.status(452).json({ message: deleteMessage });
    }

    // If the user is not soft deleted, continue to the next middleware/controller
    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkSoftDeletedLogin;
