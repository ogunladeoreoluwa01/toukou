const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");
const checkSoftDelete = require("../middlewares/softDeleteStatus");

const {
  createComment,
  editComment,
  deleteComment,
} = require("../controllers/comment.controller");

// POST route to create a new comment
router.post(
  "/create",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  createComment
);

// PUT route to edit an existing comment
router.put(
  "/edit/:commentId",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  editComment
);

// DELETE route to delete a comment
router.delete(
  "/delete/:commentId",
  authGuard,
  checkSoftDelete,
  checkBanStatus,
  deleteComment
);

module.exports = router;
