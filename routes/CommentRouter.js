/**
 * @swagger
 * tags:
 *   name: Comment
 *   description: Comment managment
 */

import express from "express";

import {
	updateComment,
	deleteComment,
	getComment,
	getAllComment,
} from "../controllers/CommentController.js"

import { authentification } from "../middlewares/Authentification.js";
import { permission } from "../middlewares/Permission.js";

const router = express.Router();

/**
 * @swagger
 * /comments/:
 *   get:
 *     summary: Return all comments
 *     tags: [Comment]
 *     responses:
 *       200:
 *         description: Comments found and returned
 *       404:
 *         description: Cannot find comments
 */
router.get("/", (request, response) => {
	getAllComment().then((comments) => {
		response.status(200).json(comments);
	}).catch(() => {
		response.status(404).json({ error: `Comments not found !` });
	});
});

/**
 * @swagger
 * /comments/{id}:
 *   get:
 *     summary: Return comment by id
 *     tags: [Comment]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Comment id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Comment found and returned
 *       404:
 *         description: Cannot find comment
 */
router.get("/:id", (request, response) => {
	getComment(request.params.id).then((comment) => {
		response.status(200).json(comment);
	}).catch(() => {
		response.status(404).json({ error: `Comment ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /comments/{id}:
 *   put:
 *     summary: Update comment by id
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Comment id
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
 *                 type: string
 *               postId:
 *                 type: string
 *     responses:
 *       202:
 *         description: Comment updated successfully
 *       401:
 *         description: Invalid token
 *       404:
 *         description: Cannot find comment
 */
router.put("/:id", authentification, (request, response) => {
	updateComment(request.params.id, request.body.content).then(() => {
		response.status(202).json({ message: `Comment ${request.params.id} updated successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `Comment ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete comment by id
 *     tags: [Comment]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: Comment id
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Comment deleted successfully
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Invalid permissions
 *       404:
 *         description: Cannot find comment
 */
router.delete("/:id", authentification, permission, (request, response) => {
	deleteComment(request.params.id).then(() => {
		response.status(202).json({ message: `Comment ${request.params.id} deleted successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `Comment ${request.params.id} not found !` });
	});
});

export default router;