import PostModel from "../models/PostModel.js";

import {
    deleteComment,
	getAllCommentByPost,
} from "../controllers/CommentController.js";

export async function createPost(title, content, userId, tags) {
	await PostModel.create({
		title: title,
		content: content,
        author: userId,
        tags: tags,
	});
}

export async function updatePost(id, title, content, tags) {
	await PostModel.findByIdAndUpdate(id, {
		title: title,
		content: content,
        tags: tags,
	});
}

export async function updatePostLike(id, userId) {
	let post = await PostModel.findById(id);

    if (post.likedBy.includes(userId)) {
        post.like -= 1;
        post.likedBy.pull(userId);
        await PostModel.findByIdAndUpdate(id, {
            like: like,
            likedBy: likedBy,
        });
    } else if (post.dislikedBy.includes(userId)) {
        post.like += 1;
        post.likedBy.push(userId);
        post.dislike -= 1;
        post.dislikedBy.pull(userId);
        await PostModel.findByIdAndUpdate(id, {
            like: like,
            likedBy: likedBy,
            dislike: dislike,
            dislikedBy: dislikedBy,
        });
    } else {
        post.like += 1;
        post.likedBy.push(userId);
        await PostModel.findByIdAndUpdate(id, {
            like: post.like,
            likedBy: post.likedBy,
        });
    }
}

export async function updatePostDislike(id, userId) {
	let post = await PostModel.findById(id);

    if (post.likedBy.includes(userId)) {
        post.like -= 1;
        post.likedBy.pull(userId);
        post.dislike += 1;
        post.dislikedBy.push(userId);
        await PostModel.findByIdAndUpdate(id, {
            likes: like,
            likedBy: likedBy,
            dislikes: dislike,
            dislikedBy: dislikedBy,
        });
    } else if (post.dislikedBy.includes(userId)) {
        post.dislike -= 1;
        post.dislikedBy.pull(userId);
        await PostModel.findByIdAndUpdate(id, {
            dislikes: dislike,
            dislikedBy: dislikedBy,
        });
    } else {
        post.dislike += 1;
        post.dislikedBy.push(userId);
        await PostModel.findByIdAndUpdate(id, {
            dislike: dislike,
            dislikedBy: dislikedBy,
        });
    }
}

export async function deletePost(id) {
    const comments = await getAllCommentByPost(id);

    comments.forEach(comment => {
        deleteComment(comment.id);
    });

	await PostModel.findByIdAndUpdate(id, {
		deletedAt: Date.now(),
	});
}

export async function getPost(id) {
	const post = await PostModel.findById(id);
	return post;
}

export async function getAllPost() {
	const posts = await PostModel.find({ deletedAt: null });
	return posts;
}