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
        bannerImage: newUser.bannerImage,
        name: newUser.username,
        email: newUser.email,
        verified: newUser.verified,
        isAdmin: newUser.isAdmin,
        superAdmin: newUser.superAdmin,
        token: token,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { userInfo, password } = req.body;

    // Check if the provided credential matches a username or an email
    const user = await User.findOne({
      $or: [{ username: userInfo }, { email: userInfo }],
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
          bannerImage: user.bannerImage,
          name: user.username,
          email: user.email,
          verified: user.verified,
          isAdmin: user.isAdmin,
          superAdmin: user.superAdmin,
          token: token,
        },
       
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

const getAllUsers = async (req, res) => {
  try {
    // Set up pagination parameters
    const limit = parseInt(req.query.limit) || 10; // Number of users per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const skip = (page - 1) * limit;

    // Fetch users with pagination, excluding banned users, and retrieve specified fields
    const users = await User.find(
      { banned: false }, // Exclude users with the banned field set to true
      "_id username profileImage email noOfPosts verified achievements superAdmin isAdmin"
    )
      .skip(skip)
      .limit(limit);

    // Get total number of users for pagination metadata
    const totalUsers = await User.countDocuments({});
    const totalPages = Math.ceil(totalUsers / limit);

    // Organize the users in the desired format
    const organizedUsers = users.reduce((acc, user) => {
      acc[user._id] = {
        _id: user._id,
        isAdmin: user.isAdmin,
        superAdmin: user.superAdmin,
        username: user.username,
        profileImage: user.profileImage,
        bannerImage: user.bannerImage,
        email: user.email,
        noOfPosts: user.noOfPosts,
        verified: user.verified,
        banned: user.banned,
        achievements: user.achievements,
      };
      return acc;
    }, {});

    // Send the organized users along with pagination metadata as a response
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalUsers: totalUsers,
      users: organizedUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
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
          bannerImage: user.bannerImage,
          name: user.username,
          email: user.email,
          verified: user.verified,
          admin: user.isAdmin,
          superAdmin: user.superAdmin,
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
        name: updatedUserProfile.username,
        email: updatedUserProfile.email,
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        bannerImage: updatedUserProfile.bannerImage,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.isAdmin,
        superAdmin: updatedUserProfile.superAdmin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const uploadUserProfilePic = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imgFolder = `${user.username},${user._id},profile image`;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: imgFolder,
    });

    if (!result) {
      return res.status(500).json({ message: "File upload failed" });
    }

    user.profileImage.profileImgUrl =
      result.secure_url || user.profileImage.profileImgUrl;
    user.profileImage.profileImgId =
      result.public_id || user.profileImage.profileImgId;
    user.profileImage.profileImgName =
      result.original_filename || user.profileImage.profileImgName;

    // Save the updated user profile
    const updatedUserProfileImage = await user.save();

    res.status(200).json({
      message: "User profileImage updated successfully",
      user: {
        _id: user._id,
        profileImage: updatedUserProfileImage.profileImage,
        bannerImage: user.bannerImage,
        name: user.username,
        email: user.email,
        verified: user.verified,
        admin: user.isAdmin,
        superAdmin: user.superAdmin,
        sex: user.sex,
        bio: user.bio,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};
const uploadUserBannerPic = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let imgFolder = `${user.username},${user._id},banner image`;

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: imgFolder,
    });

    if (!result) {
      return res.status(500).json({ message: "File upload failed" });
    }

    user.bannerImage.bannerImgUrl =
      result.secure_url || user.bannerImage.bannerImgUrl;
    user.bannerImage.bannerImgId =
      result.public_id || user.bannerImage.bannerImgId;
    user.bannerImage.bannerImgName =
      result.original_filename || user.bannerImage.bannerImgName;

    // Save the updated user profile
    const updatedUserBannerImage = await user.save();

    res.status(200).json({
      message: "User bannerImage updated successfully",
      user: {
        _id: user._id,
        profileImage: user.profileImage,
        bannerImage: updatedUserBannerImage.bannerImage,
        name: user.username,
        email: user.email,
        verified: user.verified,
        admin: user.isAdmin,
        superAdmin: user.superAdmin,
        sex: user.sex,
        bio: user.bio,
      },
    });
  } catch (error) {
    error.statusCode = 500;
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Destructure the old and new passwords from the request body
    const { oldPassword, newPassword } = req.body;

    // Check if the old password matches the current password
    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Check if the new password is the same as the current password
    const samePasswordMatch = await bcrypt.compare(newPassword, user.password);
    if (samePasswordMatch) {
      return res.status(401).json({ message: "Please change your password" });
    }

    // Check if the new password has been used previously
    const isOldPassword = await Promise.all(
      user.oldPassword.map(
        async (oldPwd) => await bcrypt.compare(newPassword, oldPwd)
      )
    ).then((results) => results.includes(true));

    if (isOldPassword) {
      return res
        .status(401)
        .json({ message: "Cannot use an already used password" });
    }

    // Set the new password (this will be hashed by the pre-save hook)
    user.oldPassword.push(user.password); // Save the current password to the oldPassword array
    user.password = newPassword; // The new password will be hashed in the pre-save hook

    // Generate a new JWT token
    const token = generateJwt(user._id);

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    // Respond with a success message
    res.status(200).json({
      message: "Password updated successfully",
      user: {
        _id: updatedUserProfile._id,
        profileImage: updatedUserProfile.profileImage,
        bannerImage: updatedUserProfile.bannerImage,
        name: updatedUserProfile.username,
        email: updatedUserProfile.email,
        verified: updatedUserProfile.verified,
        admin: updatedUserProfile.isAdmin,
        superAdmin: updatedUserProfile.superAdmin,
        sex: updatedUserProfile.sex,
        bio: updatedUserProfile.bio,
      },
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
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
    const { password, deleteReason } = req.body;

    // Check if deleteReason is provided
    if (!deleteReason) {
      return res
        .status(400)
        .json({ message: "Soft Delete reason is required" });
    }

    // Check if the provided password matches the current password
    const passwordMatch = await bcrypt.compare(password, user.password);
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
    const { password } = req.body;

    // Check if the provided password matches the current password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    // Unmark the user as deleted and clear the deletion reason
    user.deleted = false;
    user.deletionReason = "";
    const token = generateJwt(user._id);

    // Save the updated user profile
    const updatedUserProfile = await user.save();

    // Respond with a success message
    res.status(200).json({
      message: "User restored successfully",
      Token: token,
    });
  } catch (error) {
    error.statusCode = 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const banUser = async (req, res, next) => {
  try {
    const { username, banReason, banDuration } = req.body;

    // Find the user performing the ban action (the admin)
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Ensure only admins can perform the action
    if (!admin.isAdmin && !admin.superAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find the user to be banned
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the admin is trying to ban themselves
    if (user._id.equals(admin._id)) {
      return res.status(400).json({ message: "Cannot ban yourself" });
    }

    // Check if the user performing the ban action is a super admin
    if (admin.superAdmin) {
      // Super admins cannot ban other super admins
      if (user.superAdmin) {
        return res.status(403).json({ message: "Cannot ban a super admin" });
      }
    } else if (admin.isAdmin) {
      // Regular admins cannot ban other admins or super admins
      if (user.isAdmin || user.superAdmin) {
        return res
          .status(403)
          .json({ message: "Admins can only ban regular users" });
      }
    }

    // Ensure ban reason is provided
    if (!banReason) {
      return res.status(400).json({ message: "Ban reason is required" });
    }

    // Validate ban duration
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

    // Update the user document with ban details
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

    // Find the user performing the unban action (the admin)
    let admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Ensure only admins can perform the action
    if (!admin.isAdmin && !admin.superAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Find the user to be unbanned
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the user performing the unban action is a super admin
    if (admin.superAdmin) {
      // Super admins can unban any user
    } else if (admin.isAdmin) {
      // Regular admins cannot unban other admins or super admins
      if (user.isAdmin || user.superAdmin) {
        return res
          .status(403)
          .json({ message: "Admins can only unban regular users" });
      }
    }

    // Check if the user is banned
    if (!user.banned) {
      return res.status(400).json({ message: "User is not banned" });
    }

    // Update the user document to unban the user
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
    await User.deleteOne({ _id: req.user._id });

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
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.equals(admin._id)) {
      return res.status(400).json({ message: "Cannot promote yourself" });
    }

    if (user.isAdmin) {
      return res.status(403).json({ message: "User is already an admin" });
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
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.equals(admin._id)) {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }
    if (!user.isAdmin) {
      return res.status(403).json({ message: "User is already not an  admin" });
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
const permanentlyDeleteUserBySupAdmin = async (req, res, next) => {
  try {
    const { username } = req.body;
    const admin = await User.findById(req.user._id);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user._id.equals(admin._id)) {
      return res.status(400).json({ message: "Cannot demote yourself" });
    }

    // Remove the user from the database
    await User.deleteOne({ _id: req.user._id });

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
  getAllUsers,
  getProfile,
  updateProfile,
  uploadUserProfilePic,
  uploadUserBannerPic,
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
