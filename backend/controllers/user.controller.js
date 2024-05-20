const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require("../utils/cloudinaryConfig");

const generateJwt = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists (parallel queries)
    const [userName, userEmail] = await Promise.all([
      User.findOne({ username }),
      User.findOne({ email }),
    ]);

    if (userName) {
      return res.status(400).json({
        message: "User with the username already exists. Try another.",
      });
    }

    if (userEmail) {
      return res.status(400).json({
        message: "User with the email already exists. Try another.",
      });
    }

    // Hash the password before saving

    // Create a new user
    const newUser = new User({ username, email, password });
    await newUser.save();

    // Generate JWT token for the newly registered user
    const token = generateJwt(newUser._id);

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        _id: newUser._id,
        profileImage: newUser.profileImage,
        name: newUser.username,
        email: newUser.email,
        verified: newUser.verified,
        admin: newUser.admin,
      },
      token: token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { usernameOrEmail, password } = req.body;

    // Check if the provided credential matches a username or an email
    const user = await User.findOne({
      $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }],
    });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User with the provided credential does not exist." }); // Use 404 for not found
    }

    // Check if password matches
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" }); // Use 401 for unauthorized
    } else {
      // If password matches, generate JWT token
      const token = generateJwt(user._id);

      // Respond with user data and token
      res.status(200).json({
        message: "User logged in successfully.",
        user: {
          _id: user._id,
          profileImage: user.profileImage,
          name: user.username,
          email: user.email,
          verified: user.verified,
          admin: user.admin,
        },
        token: token,
        suspensions: {
          banned: user.banned,
          banReason: user.banReason,
          softdeleted: user.deleted,
          softdeletionReason: user.deletionReason,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const getProfile = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);

    if (user) {
      res.status(200).json({
        message: "User Found.",
        user: {
          _id: user._id,
          profileImage: user.profileImage,
          name: user.username,
          email: user.email,
          verified: user.verified,
          admin: user.admin,
          sex: user.sex,
          bio: user.bio,
        },
        suspensions: {
          banned: user.banned,
          banReason: user.banReason,
          softdeleted: user.deleted,
          softdeletionReason: user.deletionReason,
        },
      });
    } else {
      let error = new Error("User not found");
      error.statusCode = 404;
      next(error); // Pass the error to the error handling middleware
    }
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const updateProfile = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the new username already exists
    if (req.body.username && req.body.username !== user.username) {
      const existingUsername = await User.findOne({
        username: req.body.username,
      });
      if (existingUsername) {
        return res.status(400).json({ message: "Username is already taken" });
      }
    }

    // Check if the new email already exists
    if (req.body.email && req.body.email !== user.email) {
      const existingEmail = await User.findOne({ email: req.body.email });
      if (existingEmail) {
        return res.status(400).json({ message: "Email is already registered" });
      }
    }

    // Update user's profile fields
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.sex = req.body.sex || user.sex;
    user.bio = req.body.bio || user.bio;

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    // Respond with a success message and updated user data
    res.status(200).json({
      message: "User profile updated successfully",
      user: {
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        name: updatedUserProfile.username,
        email: updatedUserProfile.email,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.admin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

// currecbntly not working dont know why to tired to know
const uploadUserProfilePic = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "uploaded",
      use_filename: true,
      unique_filename: false,
    });

    if (result.secure_url) {
      user.profileImage = result.secure_url;
    } else {
      return res.status(400).json({ message: "Error uploading image" });
    }

    const updatedUserProfile = await user.save();

    res.status(200).json({
      message: "Profile picture updated",
      user: {
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        name: updatedUserProfile.username,
        email: updatedUserProfile.email,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.admin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const changePassword = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Destructure the old and new passwords from the request body
    const { old_Password, new_Password } = req.body;

    // Check if the old password matches the current password
    const passwordMatch = await bcrypt.compare(old_Password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Set the new password (this will be hashed by the pre-save hook)
    user.password = new_Password;

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    // Respond with a success message
    res.status(200).json({
      message: "Password updated successfully",
      user: {
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        name: updatedUserProfile.username,
        email: updatedUserProfile.email,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.admin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const SoftDelete = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Destructure the password and delete reason from the request body
    const { Password, deleteReason } = req.body;

    // Check if deleteReason is provided
    if (!deleteReason) {
      return res.status(400).json({ message: "Delete reason is required" });
    }

    // Check if the provided password matches the current password
    const passwordMatch = await bcrypt.compare(Password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Mark the user as deleted and set the deletion reason
    user.deleted = true;
    user.deletionReason = deleteReason;

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    // Respond with a success message
    res.status(200).json({
      message: "User soft deleted successfully",
      user: {
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        name: updatedUserProfile.username,
        email: updatedUserProfile.email,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.admin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
        deleted: updatedUserProfile.deleted,
        deletionReason: updatedUserProfile.deletionReason,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const unSoftDelete = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Destructure the password from the request body
    const { Password } = req.body;

    // Check if the provided password matches the current password
    const passwordMatch = await bcrypt.compare(Password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Unmark the user as deleted and clear the deletion reason
    user.deleted = false;
    user.deletionReason = "";

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    // Respond with a success message
    res.status(200).json({
      message: "User restored successfully",
      user: {
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        name: updatedUserProfile.username,
        email: updatedUserProfile.email,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.admin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};
const banUser = async (req, res, next) => {
  try {
    const { username, banReason, banDuration } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Check if the user is a super admin
    if (user.superAdmin) {
      return res.status(403).json({ message: "Cannot ban a super admin" });
    }

    if (!banReason) {
      return res.status(400).json({ message: "Ban reason is required" });
    }

    // Check if a valid ban duration is provided
    const validDurations = ["1h", "1d", "1w", "1m", "indefinite"];
    if (!banDuration || !validDurations.includes(banDuration)) {
      return res.status(400).json({
        message:
          "Valid ban duration is required: '1h', '1d', '1w', '1m', 'indefinite'",
      });
    }

    // Calculate the ban expiration date based on the duration preset
    let banExpiration = null;
    if (banDuration !== "indefinite") {
      banExpiration = new Date();
      switch (banDuration) {
        case "1h":
          banExpiration.setHours(banExpiration.getHours() + 1);
          break;
        case "1d":
          banExpiration.setDate(banExpiration.getDate() + 1);
          break;
        case "1w":
          banExpiration.setDate(banExpiration.getDate() + 7);
          break;
        case "1m":
          banExpiration.setMonth(banExpiration.getMonth() + 1);
          break;
      }
    }

    user.banned = true;
    user.banReason = banReason;
    user.banExpiration = banExpiration;

    await user.save();

    res.status(200).json({
      message: "User banned successfully",
      banExpiration: user.banExpiration,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const unbanUser = async (req, res, next) => {
  try {
    const { username } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.banned) {
      return res.status(400).json({ message: "User is not banned" });
    }

    user.banned = false;
    user.banReason = null;
    user.banExpiration = null;

    await user.save();

    res.status(200).json({
      message: "User unbanned successfully",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const permadelete = async (req, res, next) => {
  try {
    // Find the authenticated user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the provided password matches the user's password
    const { password } = req.body;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Remove the user from the database
    await user.deleteOne();

    // Respond with a success message
    res.status(200).json({
      message: "User deleted permanently",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const makeAdmin = async (req, res, next) => {
  try {
    const { username } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = true;
    await user.save();

    res.status(200).json({
      message: "User promoted to admin successfully",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};
const demoteAdmin = async (req, res, next) => {
  try {
    const { username } = req.body;

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isAdmin = false;
    await user.save();

    res.status(200).json({
      message: "User demoted from admin successfully",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};
const permanentlyDeleteUserBySupAdmin = async (req, res) => {
  try {
    const { username } = req.body;

    // Find the user by username
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove the user from the database
    await user.remove();

    // Respond with a success message
    res.status(200).json({
      message: "User deleted permanently",
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadUserProfilePic,
  changePassword,
  unSoftDelete,
  SoftDelete,
  banUser,
  unbanUser,
  permadelete,
  makeAdmin,
  demoteAdmin,
  permanentlyDeleteUserBySupAdmin,
};
