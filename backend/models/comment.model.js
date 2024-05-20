const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String },
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
