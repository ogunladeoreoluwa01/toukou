const express = require("express");
const router = express.Router();
const authGuard = require("../middlewares/authMiddleware");
const adminGuard = require("../middlewares/adminAuthMiddleware");
const superAdminGuard = require("../middlewares/superAdminAuthMiddleware");
const checkBanStatus = require("../middlewares/checkBanStatus");
const checkSoftDelete = require("../middlewares/softDeleteStatus");
const checkSoftDeleteLogin = require("../middlewares/checkDeleteStatsLogin");
const checkBanStatusLogin = require("../middlewares/checkBanStatLogin");
const upload = require("../middlewares/upload");

const { createComment, editComment, deleteComment } = require('../controllers/comment.controller');
  
 // POST route to create a new comment
router.post('/',createComment);

// PUT route to edit an existing comment
router.put('/:commentId',editComment);

// DELETE route to delete a comment
router.delete('/:commentId', deleteComment);
  

module.exports = router;
