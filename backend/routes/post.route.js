const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminAuthMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");
const checkSoftDelete = require("../middlewares/softDeleteStatus");
const upload = require("../middlewares/upload");

const {
  createPost,
  getAPost,
  editPost,
  getAllPostByAUser,
  getAllPostsFilters,
  likeAPost,
  dislikeAPost,
  deleteAPost,
} = require("../controllers/postController");

// Route for creating a new post
router.post(
  "/create",
  upload.single("image"),
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  createPost
);

// Route for retrieving a specific post
router.get(
  "/register/:postId",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  getAPost
);

// Route for editing a post
router.put(
  "/edit/:postId",
  upload.single("image"),
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  editPost
);

// Route for retrieving all posts by a specific user
router.get(
  "/postUsers/:authorId",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  getAllPostByAUser
);

// Route for retrieving all posts with filters
router.get(
  "/postsFilters",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  getAllPostsFilters
);

// Route for liking a post
router.post(
  "/like/:postId",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  likeAPost
);

// Route for disliking a post
router.post(
  "/dislike/:postId",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  dislikeAPost
);

// Route for deleting a post
router.delete(
  "/delete/:postId",
  adminGuard,
  checkSoftDelete,
  checkBanStatus,
  deleteAPost
);

module.exports = router;
