import mongoose from "mongoose";

const Post = new mongoose.model("Post", new mongoose.Schema({
	title: { type: String, required: true },
	content: { type: String, required: true },
	author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
	likes: { type: Number, default: 0 },
	dislikes: { type: Number, default: 0 },
	likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	dislikedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
	tags: { type: [String] },
	deletedAt: { type: Date, default: null },
}, { timestamps: true }));

export default Post;