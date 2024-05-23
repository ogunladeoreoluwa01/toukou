const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");

const createComment = async (req, res, next) => {
  try {
    const { content, postId } = req.body;

    // Validate the content and postId
    if (!content || !postId) {
      return res
        .status(400)
        .json({ message: "Content and postId are required" });
    }

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find the post by ID to ensure it exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Create a new comment
    const newComment = new Comment({
      text: content,
      author: user._id,
      post: postId,
      authorName: user.username,
      authorProfileImg: {
        authorProfileImgUrl: user.profileImage?.profileImgUrl || "",
        authorProfileImgId: user.profileImage?.profileImgId || "",
        authorProfileImgName: user.profileImage?.profileImgName || "",
      },
    });

    // Save the new comment
    const savedComment = await newComment.save();

    // Add the new comment's ID to the post's comments array
    post.comments.push(savedComment._id);
    await post.save();

    // Respond with success and the created comment
    return res.status(201).json({
      message: "Comment created successfully",
      comment: savedComment,
    });
  } catch (error) {
    console.error("Error creating comment:", error);
    next(error); // Pass the error to the error handling middleware
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
    if (!comment.author.equals(user._id)) {
      return res.status(403).json({
        message: "You are not authorized to edit this comment",
      });
    }

    // Update the comment content
    comment.text = content || comment.text;

    // Save the updated comment
    const savedComment = await comment.save();

    // Respond with success and the updated comment
    return res.status(200).json({
      message: "Comment updated successfully",
      comment: savedComment,
    });
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

    // Find the post associated with the comment
    const post = await Post.findById(comment.post);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the comment or has admin privileges
    if (
      comment.author.equals(req.user._id) ||
      req.user.isAdmin ||
      req.user.superAdmin
    ) {
      // Remove the comment from the post's comments array
      await Post.findByIdAndUpdate(comment.post, {
        $pull: { comments: commentId },
      });

      // Delete the comment
      await comment.deleteOne({ _id: comment.author });

      // Respond with success message
      return res.status(200).json({ message: "Comment deleted successfully" });
    } else {
      return res.status(403).json({
        message: "You are not authorized to delete this comment",
      });
    }
  } catch (error) {
    console.error("Error deleting comment:", error);
    error.statusCode = error.statusCode || 500;
    next(error); // Pass the error to the error handling middleware
  }
};

module.exports = { createComment, editComment, deleteComment }; // Exporting controllers
