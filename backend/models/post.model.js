const mongoose = require("mongoose");
const User = require("../models/user.model");
const Comment = require("./comment.model");
const Schema = mongoose.Schema;

// Define the post schema
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String },
    imageUrls: { type: String, default: "" },
    tags: { type: [String], default: [] },
    likes: { type: Number, default: 0 },

    comments: { type: [Comment], default: [] },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);


const Post = mongoose.model("Post", postSchema);

module.exports = Post;
