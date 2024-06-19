const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Define the post schema
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    authorId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    authorName: { type: String },
    authorProfileImg: {
      authorProfileImgUrl: { type: String, default: "" },
      authorProfileImgId: { type: String, default: "" },
      authorProfileImgName: { type: String, default: "" },
    },
    postImage: {
      postImgUrl: { type: String, default: "" },
      postImgId: { type: String, default: "" },
      postImgName: { type: String, default: "" },
    },
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    dislikes: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment", default: [] }],
  },
  {
    timestamps: true, // Adds `createdAt` and `updatedAt` fields
  }
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
