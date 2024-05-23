const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    text: { type: String, required: true },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    authorName: { type: String, required: true },
    authorProfileImg: {
      authorProfileImgUrl: { type: String, default: "" },
      authorProfileImgId: { type: String, default: "" },
      authorProfileImgName: { type: String, default: "" },
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = mongoose.model("Comment", commentSchema);
