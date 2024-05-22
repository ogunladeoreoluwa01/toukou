const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model"); // Corrected import name

const createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new comment
    const newComment = new Comment({
      text: content,
      author: user._id, // Use the actual user ID
      post: postId, // Use the actual post ID
    });

    // Save the new comment
    const savedComment = await newComment.save();

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: savedComment._id },
    });

    // Respond with success and the created comment
    return res
      .status(201)
      .json({ message: "Comment created successfully", comment: savedComment });
  } catch (error) {
    console.error("Error creating comment:", error);
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const editComment = async (req, res, next) => {
  try {
    const { content } = req.body;
    const { commentId } = req.params; // Corrected to use req.params

    // Find the user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the user is the author of the comment
    if (comment.author.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "You are not authorized to edit this comment" });
    }

    // Update the comment content
    comment.text = content || comment.text;

    // Save the updated comment
    const savedComment = await comment.save();

    // Respond with success and the updated comment
    return res.status(200).json({ message: "Comment updated successfully", comment: savedComment });
  } catch (error) {
    console.error("Error editing comment:", error);
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.params; // Get the comment ID from URL params

    // Find the comment by ID
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    // Check if the current user is an admin
    if (req.user.role !== "admin") {
      // If not an admin, check if the user is the author of the comment
      if (comment.author.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "You are not authorized to delete this comment" });
      }
    }

    // Remove the comment from the post's comments array
    await Post.findByIdAndUpdate(comment.post, { $pull: { comments: commentId } });

    // Delete the comment
    await comment.remove();

    // Respond with success message
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error("Error deleting comment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createComment, editComment, deleteComment }; // Exporting controllers
