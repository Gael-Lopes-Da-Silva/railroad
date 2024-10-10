/**
 * @swagger
 * tags:
 *   name: Post
 *   description: Post managment
 */

import express from "express";

import {
	createPost,
	updatePost,
	deletePost,
	updatePostDislike,
	updatePostLike,
	getPost,
	getAllPost,
} from "../controllers/PostController.js";

import {
	createComment,
} from "../controllers/CommentController.js";

import { authentification } from "../middlewares/Authentification.js";
import { permission } from "../middlewares/Permission.js";

const router = express.Router();

/**
 * @swagger
 * /posts/:
 *   post:
 *     summary: Create new post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               userId:
 *                 type: number
 *               tags:
 *                 type: [string]
 *     responses:
 *       201:
 *         description: Post created successfully
 *       401:
 *         description: Invalid token
 *       400:
 *         description: Cannot create post
 */
router.post("/", authentification, (request, response) => {
	createPost(request.body.title, request.body.content, request.body.userId, request.body.tags).then(() => {
		response.status(201).json({ message: `Post ${request.body.title} created successfully !` });
	}).catch(() => {
		response.status(400).json({ error: `Cannot create post !` });
	});
});

/**
 * @swagger
 * /posts/:
 *   get:
 *     summary: Return all posts
 *     tags: [Post]
 *     responses:
 *       200:
 *         description: Posts found and returned
 *       404:
 *         description: Cannot find posts
 */
router.get("/", (request, response) => {
	getAllPost().then((posts) => {
		response.status(202).json(posts);
	}).catch(() => {
		response.status(404).json({ error: `Posts not found !` });
	});
});

/**
 * @swagger
 * /posts/{id}:
 *   get:
 *     summary: Return post by id
 *     tags: [Post]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Post id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Post found and returned
 *       404:
 *         description: Cannot find post
 */
router.get("/:id", (request, response) => {
	getPost(request.params.id).then((post) => {
		response.status(200).json(post);
	}).catch(() => {
		response.status(404).json({ error: `Post ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /posts/{id}:
 *   put:
 *     summary: Update post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Post id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *               tags:
 *                 type: [string]
 *     responses:
 *       202:
 *         description: Post updated successfully
 *       401:
 *         description: Invalid token
 *       404:
 *         description: Cannot find post
 */
router.put("/:id", authentification, (request, response) => {
	updatePost(request.params.id, request.body.title, request.body.content, request.body.tags).then(() => {
		response.status(202).json({ message: `Post ${request.params.id} updated successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `Post ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /posts/{id}/like:
 *   put:
 *     summary: Add like to post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Post id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *     responses:
 *       202:
 *         description: Like added successfully
 *       401:
 *         description: Invalid token
 *       404:
 *         description: Cannot find post and add like
 */
router.put("/:id/like", authentification, (request, response) => {
	updatePostLike(request.params.id, request.body.userId).then(() => {
		response.status(201).json({ message: `Like added to post ${request.params.id} updated successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `Cannot add like to post ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /posts/{id}/dislike:
 *   put:
 *     summary: Add dislike to post
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Post id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: number
 *     responses:
 *       202:
 *         description: Dislike added successfully
 *       401:
 *         description: Invalid token
 *       404:
 *         description: Cannot find post and add dislike
 */
router.put("/:id/dislike", authentification, (request, response) => {
	updatePostDislike(request.params.id, request.body.userId).then(() => {
		response.status(201).json({ message: `Dislike add to post ${request.params.id} updated successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `Cannot add dislike to post ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /posts/{id}:
 *   delete:
 *     summary: Delete post by id
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Post id
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Post deleted successfully
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Invalid permissions
 *       404:
 *         description: Cannot find post
 */
router.delete("/:id", authentification, permission, (request, response) => {
	deletePost(request.params.id).then(() => {
		response.status(202).json({ message: `Post ${request.params.id} deleted successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `Post ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /posts/{id}/comment:
 *   post:
 *     summary: Create new comment
 *     tags: [Post]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Post id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               userId:
 *                 type: number
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       401:
 *         description: Invalid token
 *       400:
 *         description: Cannot create comment
 */
router.post("/:id/comment", authentification, (request, response) => {
	createComment(request.body.content, request.body.userId, request.params.id).then(() => {
		response.status(201).json({ message: `Comment created successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `Cannot add comment to post ${request.params.id} not found !` });
	});
});

export default router;