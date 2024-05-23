const User = require("../models/user.model");
const Post = require("../models/post.model");
const cloudinary = require("../utils/cloudinaryConfig");
const Comment = require("../models/comment.model");

const createPost = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    // Find the user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new post instance
    const post = new Post({
      title,
      content,
      authorId: req.user._id,
      authorName: user.username,
      authorProfileImg: {
        authorProfileImgUrl: user.profileImage?.profileImgUrl || "",
        authorProfileImgId: user.profileImage?.profileImgId || "",
        authorProfileImgName: user.profileImage?.profileImgName || "",
      },
    });

    // Check if a file is provided in the request
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Define the image folder structure for Cloudinary
    const imgFolder = `${user.username},${user._id},${post._id},${post.title},post image`;

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: imgFolder,
    });

    // If the upload result is empty or invalid, return an error
    if (!result || !result.secure_url) {
      return res.status(500).json({ message: "File upload failed" });
    }

    // Update the post with the image information
    post.postImage = {
      postImgUrl: result.secure_url,
      postImgId: result.public_id,
      postImgName: result.original_filename,
    };

    // Increment the user's post count and save the user
    user.noOfPosts++;
    await user.save();

    // Save the updated post
    const updatedPost = await post.save();

    // Respond with the updated post information
    res
      .status(201)
      .json({ message: "Post created successfully", post: updatedPost });
  } catch (error) {
    console.error("Error creating post:", error);
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

const getAPost = async (req, res, next) => {
  try {
    const { postId } = req.params; // Assuming postId is passed in the URL params

    // Find the post by ID and populate comments and their authors
    const post = await Post.findById(postId).populate({
      path: "comments",
      populate: {
        path: "author",
        select: "username profileImage", // Select the fields you need from the author
      },
      select: "text", // Select the text field from comments
    });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json({
      message: "Post retrieved successfully",
      post, // Simplified to just: post
    });
  } catch (error) {
    console.error("Error retrieving post:", error);
    error.statusCode = error.statusCode || 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const editPost = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { postId } = req.params; // Corrected to use req.params

    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!post.authorId.equals(req.user._id)) {
      return res
        .status(403)
        .json({ message: "Only post author allowed to edit their post" });
    }

    // Update post properties based on request data
    post.authorName = req.body.authorName || post.authorName;
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;

    // Handle image upload if file exists in request
    if (req.file) {
      let imgFolder = `${user.username},${user._id},${post._id},${post.title},post image`;
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: imgFolder,
      });

      post.postImage = {
        postImgUrl: result.secure_url || post.postImage.postImgUrl,
        postImgId: result.public_id || post.postImage.postImgId,
        postImgName: result.original_filename || post.postImage.postImgName,
      };
    }

    // Save the updated post
    const updatedPost = await post.save();

    // Respond with appropriate message and updated post data
    res.status(200).json({
      message: req.file
        ? "Post updated with an image"
        : "Post updated without an image",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error editing post:", error);
    error.statusCode = error.statusCode || 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const getAllPostByAUser = async (req, res) => {
  try {
    const { authorId } = req.params;

    // Check if the user exists
    const user = await User.findById(authorId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Set up pagination parameters
    const limit = parseInt(req.query.limit) || 10; // Number of posts per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const skip = (page - 1) * limit;

    // Fetch posts with pagination and populate comments and authors
    const posts = await Post.find({ authorId: authorId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "comments",
        populate: {
          path: "author",
          select: "username profileImage", // Select the fields you need from the author
        },
        select: "text", // Select the text field from comments
      });

    // Organize posts as an object with postId as key
    const organizedPosts = posts;

    // Get total number of posts for pagination metadata
    const totalPosts = await Post.countDocuments({ authorId: authorId });
    const totalPages = Math.ceil(totalPosts / limit);

    // Send the posts along with pagination metadata as a response
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
      posts: [organizedPosts],
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAllPostsFilters = async (req, res) => {
  try {
    // Set up pagination parameters
    const limit = parseInt(req.query.limit) || 10; // Number of posts per page
    const page = parseInt(req.query.page) || 1; // Current page number
    const skip = (page - 1) * limit;

    // Sorting criteria
    let sortCriteria = { createdAt: -1 }; // Default sorting by createdAt date (most recent)

    // Filter criteria
    let filterCriteria = {};

    // Check if filter parameters are provided in the query
    if (req.query.date) {
      const date = new Date(req.query.date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);

      filterCriteria.createdAt = {
        $gte: date,
        $lt: nextDay,
      };
    }
    if (req.query.title) {
      filterCriteria.title = { $regex: req.query.title, $options: "i" }; // Filter by title (case-insensitive)
    }

    // Check if a sorting parameter is provided in the query
    if (req.query.sortBy) {
      switch (req.query.sortBy) {
        case "comments": // Sort by number of comments
          sortCriteria = { commentsCount: -1 };
          break;
        case "likes": // Sort by number of likes
          sortCriteria = { likesCount: -1 };
          break;
        default:
          sortCriteria = { createdAt: -1 };
      }
    }

    const posts = await Post.aggregate([
      { $match: filterCriteria },
      {
        $addFields: {
          commentsCount: { $size: "$comments" },
          likesCount: { $size: "$likes" },
        },
      },
      { $sort: sortCriteria },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: "comments",
          localField: "comments",
          foreignField: "_id",
          as: "comments",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "author",
              },
            },
            {
              $unwind: "$author",
            },
            {
              $project: {
                text: 1,
                "author.username": 1,
                "author.profileImage": 1,
              },
            },
          ],
        },
      },
    ]);

    // Organize the posts by post ID
    const organizedPosts = posts;

    // Get total number of posts for pagination metadata
    const totalPosts = await Post.countDocuments(filterCriteria);
    const totalPages = Math.ceil(totalPosts / limit);

    // Send the posts along with pagination metadata as a response
    res.status(200).json({
      currentPage: page,
      totalPages: totalPages,
      totalPosts: totalPosts,
      posts:organizedPosts,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const likeAPost = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { postId } = req.params; // Corrected to use req.params

    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove user ID from dislikes array if it exists
    post.dislikes = post.dislikes.filter(
      (userId) => userId.toString() !== user._id.toString()
    );

    // Check if user already liked the post
    const userLiked = post.likes.includes(user._id);

    if (userLiked) {
      // If user already liked, remove user ID from likes array
      post.likes = post.likes.filter(
        (userId) => userId.toString() !== user._id.toString()
      );
    } else {
      // If user hasn't liked, add user ID to likes array
      post.likes.push(user._id);
    }

    // Save the updated post
    const updatedPost = await post.save();

    // Respond with appropriate message and updated post data
    res.status(200).json({
      message: userLiked ? "Post like removed" : "Post liked",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error liking post:", error);
    error.statusCode = error.statusCode || 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const dislikeAPost = async (req, res, next) => {
  try {
    // Find the user by ID
    let user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { postId } = req.params; // Corrected to use req.params

    let post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Remove user ID from likes array if it exists
    post.likes = post.likes.filter(
      (userId) => userId.toString() !== user._id.toString()
    );

    // Check if user already disliked the post
    const userDisliked = post.dislikes.includes(user._id);

    if (userDisliked) {
      // If user already disliked, remove user ID from dislikes array
      post.dislikes = post.dislikes.filter(
        (userId) => userId.toString() !== user._id.toString()
      );
    } else {
      // If user hasn't disliked, add user ID to dislikes array
      post.dislikes.push(user._id);
    }

    // Save the updated post
    const updatedPost = await post.save();

    // Respond with appropriate message and updated post data
    res.status(200).json({
      message: userDisliked ? "Post dislike removed" : "Post disliked",
      post: updatedPost,
    });
  } catch (error) {
    console.error("Error disliking post:", error);
    error.statusCode = error.statusCode || 500;
    next(error); // Pass the error to the error handling middleware
  }
};

const deleteAPost = async (req, res, next) => {
  try {
    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { postId } = req.params;

    // Find the post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user is the author of the post or has admin privileges
    if (
      post.authorId.equals(req.user._id) ||
      req.user.isAdmin ||
      req.user.superAdmin
    ) {
      // Delete all comments related to the post
      await Comment.deleteMany({ _id: { $in: post.comments } });

      // Delete the post
      await Post.deleteOne({ _id: postId });

      // Respond with appropriate message
      res.status(200).json({ message: "Post deleted" });
    } else {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }
  } catch (error) {
    console.error("Error deleting post:", error);
    error.statusCode = error.statusCode || 500;
    next(error); // Pass the error to the error handling middleware
  }
};

module.exports = {
  createPost,
  getAPost,
  editPost,
  getAllPostByAUser,
  getAllPostsFilters,
  likeAPost,
  dislikeAPost,
  deleteAPost,
};
