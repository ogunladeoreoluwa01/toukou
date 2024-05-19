const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cloudinary = require('cloudinary').v2;

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

const uploadUserProfilePic = async (req, res, next) => {
  try {
    let user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ message: "Use not found" });
    }

    cloudinary.uploader.upload(req.file.path, {
      gravity: "auto",
      height: 940,
      width: 880,
      crop: "auto",
    }),
      function (err, result) {
        if (err) {
          res.status(500).json({ message: "failed to upload", error: err });
        }
      };
    let data = { result };
    console.log(data);

    user.profileImage = req.body.bio || user.profileImage;

    const updateUserProfile = await user.save();
    res.status(200).json({
      message: "picture  Updated",
      testimage: { data },
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

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  uploadUserProfilePic,
};
//   getUsers,
//   getUser,
//   addUser,
//   updateUser,
//   deleteUser,
//   softDeleteUser,
//   unsoftDeleteUser,
//   followUser,
//   unfollowUser,
//   getFollowersInfo,
//   getFollowingInfo,
// };

// const getUsers = async (req, res) => {
//   try {
//     // Pagination
//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided or invalid
//     const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided or invalid
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
//       return res.status(400).json({ message: "Invalid page or limit parameters" });
//     }
//     const users = await User.find()
//       .select("-password -__v")
//       .skip(startIndex)
//       .limit(limit);
//     const totalDocuments = await User.countDocuments({});

//     // Pagination result
//     const totalPages = Math.ceil(totalDocuments / limit);
//     const hasNextPage = endIndex < totalDocuments;
//     const hasPreviousPage = startIndex > 0;

//     res.status(200).json({
//       users,
//       pagination: {
//         page,
//         totalPages,
//         hasNextPage,
//         hasPreviousPage,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getUser = async (req, res) => {
//   try {
//     const { userId, username } = req.body;
//     let user;

//     if (userId) {
//       user = await User.findById(userId).select("-password -__v");
//     } else if (username) {
//       user = await User.findOne({ username: username }).select("-password -__v");
//     }

//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const addUser = async (req, res) => {
//   try {
//     // Check if a user with the given email or username already exists
//     const existingUser = await User.findOne({
//       $or: [{ email: req.body.email }, { username: req.body.username }],
//     });
//     if (existingUser) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Generate salt and hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPass = await bcrypt.hash(req.body.password, salt);

//     // Create user with hashed password
//     const user = await User.create({
//       username: req.body.username,
//       email: req.body.email,
//       password: hashedPass, // Store the hashed password
//       // Other user data...
//     });

//     // Exclude password from the response
//     const { password, __v, ...userData } = user.toObject();
//     res.status(200).json(userData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const updateUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userName = req.body.username;
//     const userPassword = req.body.password;
//     const userEmail = req.body.email;
//     const { banned, banReason,role,tier} = req.body;
//     // Find the user by ID
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     // If the user is not an admin, restrict modification of banned and banReason fields
//     if (req.user.role !== "admin") {
//       delete req.body.banned;
//       delete req.body.role;
//       delete req.body.banReason;
//       delete req.body.tier;
//       return res.status(403).json({
//         message: "User not authorized to modify banned status or ban reason",
//       });
//     }
//     // Check if the username is being changed
//     if (userName) {
//       // If the username is being changed, ensure it's unique
//       if (user.username !== userName) {
//         const existingUser = await User.findOne({ username: userName });
//         if (existingUser) {
//           return res.status(403).json({ message: "Username already exists" });
//         }
//       }
//     }

//     // Check if the email is being changed
//     if (userEmail) {
//       // Find the user by ID
//       const user = await User.findById(id);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       // If the email is being changed, ensure it's unique
//       if (user.email !== userEmail) {
//         const existingUser = await User.findOne({ email: userEmail });
//         if (existingUser) {
//           return res.status(400).json({ message: "Email already exists" });
//         }
//       }
//     }

//     // Hash the password if it's being changed
//     if (userPassword && userPassword !== "") {
//       const salt = await bcrypt.genSalt(10);
//       const hashedPass = await bcrypt.hash(userPassword, salt); // Fixed variable name
//       req.body.password = hashedPass;
//     }

//     // Update the user
//     const updatedUser = await User.findByIdAndUpdate(id, req.body, {
//       new: true,
//     });

//     if (!updatedUser) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Exclude password and other sensitive fields from response
//     const { password, __v, ...userData } = updatedUser.toObject();
//     res.status(200).json(userData);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const softDeleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const newDeletionReason = req.body.deletionReason;

//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     await User.updateOne(
//       { _id: id },
//       { $set: { deleted: true, deletionReason: newDeletionReason } }
//     );

//     res.status(200).json({ message: "User soft deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// const unsoftDeleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update the user document
//     await User.updateOne(
//       { _id: id },
//       { $set: { deleted: false, deletionReason: undefined } }
//     );

//     res.status(200).json({ message: "User unsoft deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const deleteUser = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const user = await User.findByIdAndDelete(id);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }
//     res.status(200).json({ message: "User deleted" });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const followUser = async (req, res) => {
//   try {
//     const { followerId, followedId } = req.body;

//     // Check if followerId and followedId are provided
//     if (!followerId || !followedId) {
//       return res.status(400).json({
//         message: "Both followerId and followedId are required.",
//       });
//     }

//     // Find the follower user by ID
//     const follower = await User.findById(followerId);
//     if (!follower) {
//       return res.status(404).json({ message: "Follower user not found." });
//     }

//     // Find the followed user by ID
//     const followed = await User.findById(followedId);
//     if (!followed) {
//       return res.status(404).json({ message: "Followed user not found." });
//     }

//     // Update follower's document to add followedId to followers array
//     if (!follower.followers.includes(followedId)) {
//       follower.followers.push(followedId);
//       await follower.save();
//     }

//     // Update followed's document to add followerId to following array
//     if (!followed.following.includes(followerId)) {
//       followed.following.push(followerId);
//       await followed.save();
//     }

//     res.status(200).json({ message: "User followed successfully." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const unfollowUser = async (req, res) => {
//   try {
//     const { followerId, followedId } = req.body;

//     // Check if followerId and followedId are provided
//     if (!followerId || !followedId) {
//       return res.status(400).json({
//         message: "Both followerId and followedId are required.",
//       });
//     }

//     // Find the follower user by ID
//     const follower = await User.findById(followerId);
//     if (!follower) {
//       return res.status(404).json({ message: "Follower user not found." });
//     }

//     // Find the followed user by ID
//     const followed = await User.findById(followedId);
//     if (!followed) {
//       return res.status(404).json({ message: "Followed user not found." });
//     }

//     // Remove followedId from the followers array of the follower's document
//     follower.followers = follower.followers.filter(
//       (id) => id.toString() !== followedId.toString()
//     );
//     await follower.save();

//     // Remove followerId from the following array of the followed user's document
//     followed.following = followed.following.filter(
//       (id) => id.toString() !== followerId.toString()
//     );
//     await followed.save();

//     res.status(200).json({ message: "User unfollowed successfully." });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getFollowersInfo = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Get details of the users who are followers of the current user
//     const followerIds = user.followers;

//     // Pagination
//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided or invalid
//     const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided or invalid
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
//       return res.status(400).json({ message: "Invalid page or limit parameters" });
//     }
//     const followersDetails = await User.find({
//       _id: { $in: followerIds },
//     })
//       .select("-password -_v")
//       .skip(startIndex)
//       .limit(limit);

//     // Return the total count of followers along with their details
//     const totalFollowers = followerIds.length;
//     const totalPages = Math.ceil(totalFollowers / limit);
//     const hasNextPage = endIndex < totalFollowers;
//     const hasPreviousPage = startIndex > 0;

//     res.status(200).json({
//       totalFollowers,
//       followers: followersDetails,
//       pagination: {
//         page,
//         totalPages,
//         hasNextPage,
//         hasPreviousPage,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// const getFollowingInfo = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     // Find the user by ID
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     // Get details of the users who are followed by the current user
//     const followingIds = user.following;

//     // Pagination
//     const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided or invalid
//     const limit = parseInt(req.query.limit) || 10; // Default to limit 10 if not provided or invalid
//     const startIndex = (page - 1) * limit;
//     const endIndex = page * limit;
//     if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
//       return res.status(400).json({ message: "Invalid page or limit parameters" });
//     }
//     const followingDetails = await User.find({
//       _id: { $in: followingIds },
//     })
//       .select("-password -_v")
//       .skip(startIndex)
//       .limit(limit);

//     // Return the total count of following along with their details
//     const totalFollowing = followingIds.length;
//     const totalPages = Math.ceil(totalFollowing / limit);
//     const hasNextPage = endIndex < totalFollowing;
//     const hasPreviousPage = startIndex > 0;

//     res.status(200).json({
//       totalFollowing,
//       following: followingDetails,
//       pagination: {
//         page,
//         totalPages,
//         hasNextPage,
//         hasPreviousPage,
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// module.exports = {
//   getUsers,
//   getUser,
//   addUser,
//   updateUser,
//   deleteUser,
//   softDeleteUser,
//   unsoftDeleteUser,
//   followUser,
//   unfollowUser,
//   getFollowersInfo,
//   getFollowingInfo,
// };
