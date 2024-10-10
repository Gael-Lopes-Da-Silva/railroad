import mongoose from "mongoose";

const Comment = new mongoose.model("Comment", new mongoose.Schema({
	content: { type: String, required: true },
	author: { type: String, required: true },
	post: { type: String, required: true },
	deletedAt: { type: Date, default: null },
}, { timestamps: true }));

export default Comment;