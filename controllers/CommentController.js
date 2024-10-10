import CommentModel from "../models/CommentModel.js";

export async function createComment(content, author, post) {
	await CommentModel.create({
		content: content,
		author: author,
		post: post,
	});
}

export async function updateComment(id, content) {
	await CommentModel.findByIdAndUpdate(id, {
		content: content,
	});
}

export async function deleteComment(id) {
	await CommentModel.findByIdAndUpdate(id, {
		deletedAt: Date.now(),
	});
}

export async function getComment(id) {
	const comment = await CommentModel.findById(id);
	return comment;
}

export async function getAllComment() {
	const comments = await CommentModel.find({ deletedAt: null });
	return comments;
}

export async function getAllCommentByPost(postId) {
	const comments = await CommentModel.find({ post: postId });
	return comments;
}