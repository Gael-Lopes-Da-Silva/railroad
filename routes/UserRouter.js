/**
 * @swagger
 * tags:
 *   name: User
 *   description: User managment
 */

import express from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config";

import {
	createUser,
	updateUser,
	deleteUser,
	getUser,
	getAllUser,
	login,
} from "../controllers/UserController.js";

import { authentification } from "../middlewares/Authentification.js";
import { permission } from "../middlewares/Permission.js";

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Create new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Cannot create user
 */
router.post("/register", (request, response) => {
	createUser(request.body.username, request.body.email, request.body.password).then(() => {
		response.status(201).json({ message: `User ${request.body.username} created successfully !` });
	}).catch(() => {
		response.status(400).json({ error: `Cannot create user !` });
	});
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Login user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User successfully authentificated
 *       401:
 *         description: Invalid email or password
 */
router.post("/login", (request, response) => {
	login(request.body.email, request.body.password).then((user) => {
		if (user) {
			const secret = process.env.SECRET;
			const token = jsonwebtoken.sign({ id: user.id, permission: user.permission }, secret, {expiresIn: "1h"});
			response.status(200).json({ token: token });
		} else {
			response.status(404).json({ error: `Invalid email or password !` });
		}
	}).catch(() => {
		response.status(404).json({ error: `Cannot find user account !` });
	})
});

/**
 * @swagger
 * /users/:
 *   get:
 *     summary: Return all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users found and returned
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Invalid permissions
 *       404:
 *         description: Cannot find users
 */
router.get("/", authentification, permission, (request, response) => {
	getAllUser().then((users) => {
		response.status(200).json(users);
	}).catch(() => {
		response.status(404).json({ error: `Users not found !` });
	});
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Return user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User found and returned
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Invalid permissions
 *       404:
 *         description: Cannot find user
 */
router.get("/:id", authentification, permission, (request, response) => {
	getUser(request.params.id).then((user) => {
		response.status(200).json(user);
	}).catch(() => {
		response.status(404).json({ error: `User ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       202:
 *         description: User updated successfully
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Invalid permissions
 *       404:
 *         description: Cannot find user
 */
router.put("/:id", authentification, permission, (request, response) => {
	updateUser(request.params.id, request.body.username, request.body.email, request.body.password).then(() => {
		response.status(202).json({ message: `User ${request.params.id} updated successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `User ${request.params.id} not found !` });
	});
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete user by id
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User id
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: User deleted successfully
 *       401:
 *         description: Invalid token
 *       403:
 *         description: Invalid permissions
 *       404:
 *         description: Cannot find user
 */
router.delete("/:id", authentification, permission, (request, response) => {
	deleteUser(request.params.id).then(() => {
		response.status(202).json({ message: `User ${request.params.id} deleted successfully !` });
	}).catch(() => {
		response.status(404).json({ error: `User ${request.params.id} not found !` });
	});
});

export default router;