const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const checkSoftDelete = async (req, res, next) => {
  try {
    // Check if req.user is set by your authentication middleware
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userId = req.user._id;
    let user = await User.findById(userId);

    if (user && user.deleted) {
      let deleteMessage = "you have soft deleted your account your .";

      if (user.deletionReason) {
        deleteMessage += ` Reason: ${user.deletionReason}`;
      }

      return res.status(452).json({ message: deleteMessage });
    }

    next();
  } catch (error) {
    console.error(error); // Log the error for debugging purposes
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = checkSoftDelete;
