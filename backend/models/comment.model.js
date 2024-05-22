const User = require("../models/user.model");
const Post = require("../models/post.model");
const Comment = require("../models/comment.model");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt fields
});


module.exports = mongoose.model("Comment", commentSchema);

module.exports = {};
