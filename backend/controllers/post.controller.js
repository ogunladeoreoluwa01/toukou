const User = require("../models/user.model");
const Post = require("../models/post.model");


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

  const createPost = async (req, res, next) => {
    try {
      const { title, content, imageUrls, tags } = req.body;
  
      // Fetch the user from the database
      const user = await User.findById(req.user._id);
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Construct the post object
      const post = new Post({
        title,
        content,
        authorId: req.user._id, // Use req.user._id directly
        authorName: user.username, // Set the author's name
        imageUrls,
        tags,
      });
  
      // Save the post to the database
      await post.save();
  
      // Send a success response
      res.status(201).json({ message: "Post created successfully", post });
    } catch (error) {
      // Handle errors
      console.error("Error creating post:", error);
      error.statusCode = error.statusCode || 500;
      next(error); // Pass the error to the error handling middleware
    }
  };
 
  


  module.exports = {
   
  };