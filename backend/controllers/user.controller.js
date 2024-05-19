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
    let user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "Use not found" });
    }
    user.username = req.body.username || user.username;
    user.email = req.body.email || user.email;
    user.sex = req.body.sex || user.sex;
    user.bio = req.body.bio || user.bio;

    const updateUserProfile = await user.save();

    res.status(200).json({
      message: "user Updated",
      user: {
        _id: updateUserProfile._id,
        profileImage: updateUserProfile.profileImage,
        name: updateUserProfile.username,
        email: updateUserProfile.email,
        verified: updateUserProfile.verified,
        admin: updateUserProfile.admin,
        sex: updateUserProfile.sex,
        bio: updateUserProfile.bio,
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

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadUserProfilePic,
  changePassword,
  unSoftDelete,
  SoftDelete,
};
