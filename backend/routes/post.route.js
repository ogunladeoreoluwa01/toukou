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
  uploadPostImage,
  getAllPostsFilters,
  likeAPost,
  dislikeAPost,
  deleteAPost,
} = require("../controllers/post.controller");

// Route for creating a new post
router.post("/create", authGuard, checkSoftDelete, checkBanStatus, createPost);
router.put(
  "/uploadpostimg/:postId",
  upload.single("image"),
  authGuard,
  uploadPostImage
);


// Route for retrieving a specific post
router.get("/getpost/:postId", getAPost);

// Route for editing a post
router.put(
  "/edit/:postId",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  editPost
);

// Route for retrieving all posts by a specific user
router.get("/postallUsers/:authorId", getAllPostByAUser);

// Route for retrieving all posts with filters
router.get("/postsFilters", getAllPostsFilters);

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
