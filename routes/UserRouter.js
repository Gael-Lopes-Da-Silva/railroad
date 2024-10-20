/**
 * @swagger
 * tags:
 *   name: User
 *   description: User managment
 */
import express from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config"; // populate process.end with what's inside .env
import joi from "joi";

import {
    createUser,
    updateUser,
    deleteUser,
    getUser,
    getAllUsers,
    login,
    setAdmin,
    setEmployee,
    setUser,
} from "../controllers/UserController.js";

import { authentification } from "../middlewares/Authentification.js";
import { checkAdmin } from "../middlewares/CheckAdmin.js";
import { checkEmployee } from "../middlewares/CheckEmployee.js";

const router = express.Router();

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo:
 *                 type: string
 *                 description: Username for the new user
 *                 example: "newUser123"
 *               email:
 *                 type: string
 *                 description: Email address of the new user
 *                 example: "newuser@example.com"
 *               password:
 *                 type: string
 *                 description: Password for the new user
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User registered successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Validation error while registering user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while registering user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Validation error details"
 *       500:
 *         description: Internal server error while registering user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while registering user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Internal server error"
 */
router.post("/register", (request, response) => {
    const userSchema = joi.object({
        pseudo: joi.string().alphanum().min(3).max(30).required(),
        email: joi.string().email().max(320).required(),
        password: joi.string().min(8).max(320).required(),
    });
    const userInput = {
        pseudo: request.body.pseudo,
        email: request.body.email,
        password: request.body.password,
    };

    // we check if the user input are valid
    const { error } = userSchema.validate(userInput);

    if (error) {
        return response.status(404).json({
            message: "Something went wrong while registering user !",
            error: 1,
            error_message: error,
        });
    }
    
    // we try to create the user
    createUser(request).then(() => {
        response.status(201).json({
            message: "User registered successfully !",
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while registering user !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticate user and return a token
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
 *                 description: The email of the user
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The password of the user
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User logged successfully !"
 *                 token:
 *                   type: string
 *                   description: JWT token for accessing protected routes
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while logging user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Invalid email or password !"
 *       500:
 *         description: Something went wrong while logging user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while logging user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/login", (request, response) => {
    const userSchema = joi.object({
        email: joi.string().email().max(320).required(),
        password: joi.string().min(8).max(320).required(),
    });
    const userInput = {
        email: request.body.email,
        password: request.body.password,
    };
    
    // we check if the user input are valid
    const { error } = userSchema.validate(userInput);

    if (error) {
        return response.status(404).json({
            message: "Something went wrong while logging user !",
            error: 1,
            error_message: error,
        });
    }
    
    // we try to login user
    login(request).then((user) => {
        if (user) {
            const secret = process.env.SECRET; // get secret key from .env
            const token = jsonwebtoken.sign({ id: user.id }, secret, { expiresIn: "24h" }); // create the token with the user id inside

            response.status(200).json({
                message: "User logged successfully !",
                token: token,
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while logging user !",
                error: 1,
                error_message: "Invalid email or password !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while logging user !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/get:
 *   post:
 *     summary: Retrieve all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           description: Optional sort parameters, can include fields like pseudo, email, role. Use '-' for descending order (e.g., '-role').
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Optional limit on the number of results to return.
 *           default: 10
 *     responses:
 *       202:
 *         description: Users fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Users fetched successfully !"
 *                 users:
 *                   type: array
 *                   description: List of users
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the user
 *                         example: "60d0fe4f5311236168a109ca"
 *                       pseudo:
 *                         type: string
 *                         description: Username of the user
 *                         example: "user123"
 *                       email:
 *                         type: string
 *                         description: Email address of the user
 *                         example: "user@example.com"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       500:
 *         description: Something went wrong while fetching users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching users !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/get", authentification, checkEmployee, (request, response) => {
    // we try to get all users
    // we can use queries like sort or limit to sort output
    getAllUsers(request).then((users) => {
        response.status(202).json({
            message: "Users fetched successfully !",
            users: users,
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while fetching users !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/get/{id}:
 *   post:
 *     summary: Retrieve user details by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: User fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User fetched successfully !"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the user
 *                       example: "60d0fe4f5311236168a109ca"
 *                     pseudo:
 *                       type: string
 *                       description: Username of the user
 *                       example: "user123"
 *                     email:
 *                       type: string
 *                       description: Email address of the user
 *                       example: "user@example.com"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find user !"
 *       500:
 *         description: Something went wrong while fetching user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/get/:id", authentification, checkEmployee, (request, response) => {
    // we try to get user by the given id
    getUser(request).then((user) => {
        if (user) {
            response.status(202).json({
                message: "User fetched successfully !",
                user: user,
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while fetching user !",
                error: 1,
                error_message: "Can't find user !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while fetching user !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/update:
 *   post:
 *     summary: Update authenticated user details
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo:
 *                 type: string
 *                 description: The new username for the user
 *                 example: "newPseudo"
 *               email:
 *                 type: string
 *                 description: The new email address for the user
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The new password for the user
 *                 example: "newPassword123"
 *     responses:
 *       202:
 *         description: User updated successfully
 *       404:
 *         description: Cannot find user
 *       500:
 *         description: Something went wrong while updating user
 */
router.post("/update", authentification, (request, response) => {
    const userSchema = joi.object({
        pseudo: joi.string().alphanum().min(3).max(30),
        email: joi.string().email().max(320),
        password: joi.string().min(8).max(320),
    });
    const userInput = {
        pseudo: request.body.pseudo,
        email: request.body.email,
        password: request.body.password,
    };
    
    // we check if the user input are valid
    const { error } = userSchema.validate(userInput);
    
    if (error) {
        return response.status(404).json({
            message: "Something went wrong while updating user !",
            error: 1,
            error_message: error,
        });
    }
    
    // we try to update the user with the given body fields
    // not all fields are required !
    updateUser(request).then((user) => {
        if (user) {
            response.status(202).json({
                message: "User updated successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while updating user !",
                error: 1,
                error_message: "Can't find user !",
            }); 
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while updating user !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/update/{id}:
 *   post:
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
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pseudo:
 *                 type: string
 *                 description: The new username for the user
 *                 example: "newPseudo"
 *               email:
 *                 type: string
 *                 description: The new email adresse for the user
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 description: The new password for the user
 *                 example: "newPassword"
 *     responses:
 *       202:
 *         description: User updated successfully
 *       404:
 *         description: Cannot find user
 *       500:
 *         description: Something went wrong while updating user
 */
router.post("/update/:id", authentification, checkAdmin, (request, response) => {
    const userSchema = joi.object({
        pseudo: joi.string().alphanum().min(3).max(30),
        email: joi.string().email().max(320),
        password: joi.string().min(8).max(320),
    });
    const userInput = {
        pseudo: request.body.pseudo,
        email: request.body.email,
        password: request.body.password,
    };
    
    // we check if the user input are valid
    const { error } = userSchema.validate(userInput);

    if (error) {
        return response.status(404).json({
            message: "Something went wrong while updating user !",
            error: 1,
            error_message: error,
        });
    }
    
    // we try to update the user of the given id with the given body fields
    // not all fields are required !
    updateUser(request).then((user) => {
        if (user) {
            response.status(202).json({
                message: "User updated successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while updating user !",
                error: 1,
                error_message: "Can't find user !",
            }); 
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while updating user !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/delete:
 *   post:
 *     summary: Delete the authenticated user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deleting user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find user !"
 *       500:
 *         description: Internal server error while deleting user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deleting user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/delete", authentification, (request, response) => {
    // we try to delete user
    deleteUser(request).then((user) => {
        if (user) {
            response.status(202).json({
                message: "User deleted successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while deleting user !",
                error: 1,
                error_message: "Can't find user !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while deleting user !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/delete/{id}:
 *   post:
 *     summary: Delete user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deleting user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find user !"
 *       500:
 *         description: Internal server error while deleting user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deleting user !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/delete/:id", authentification, checkAdmin, (request, response) => {
    // we try to delete user of the given id
    deleteUser(request).then((user) => {
        if (user) {
            response.status(202).json({
                message: "User deleted successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while deleting user !",
                error: 1,
                error_message: "Can't find user !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while deleting user !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/set/admin/{id}:
 *   post:
 *     summary: Update the role of an user to admin by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: New role for the user (set to "admin")
 *                 example: "admin"
 *     responses:
 *       202:
 *         description: Role changed to admin successfully
 *       404:
 *         description: Cannot find user
 *       500:
 *         description: Something went wrong while setting user role to admin
 */
router.post("/set/admin/:id", authentification, checkAdmin, (request, response) => {
    // we try to set to admin the role of the user of the given id
    setAdmin(request).then((user) => {
        if (user) {
            response.status(202).json({
                message: "Role changed to admin successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while seting user role to admin !",
                error: 1,
                error_message: "Can't find user !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while seting user role to admin !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/set/employee/{id}:
 *   post:
 *     summary: Update the role of a user to employee by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: New role for the user (set to "employee")
 *                 example: "employee"
 *     responses:
 *       202:
 *         description: Role changed to employee successfully
 *       404:
 *         description: Cannot find user
 *       500:
 *         description: Something went wrong while setting user role to employee
 */
router.post("/set/employee/:id", authentification, checkAdmin, (request, response) => {
    // we try to set to employee the role of the user of the given id
    setEmployee(request).then((user) => {
        if (user) {
            response.status(202).json({
                message: "Role changed to employee successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while seting user role to employee !",
                error: 1,
                error_message: "Can't find user !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while seting user role to employee !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /users/set/user/{id}:
 *   post:
 *     summary: Update the role of an user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: User ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 description: New role for the user (e.g., "admin", "user", "employee")
 *                 example: "admin"
 *     responses:
 *       202:
 *         description: Role changed to user successfully
 *       404:
 *         description: Cannot find user
 *       500:
 *         description: Something went wrong while setting user role
 */
router.post("/set/user/:id", authentification, checkAdmin, (request, response) => {
    // we try to set to user the role of the user of the given id
    setUser(request).then((user) => {
        if (user) {
            response.status(202).json({
                message: "Role changed to user successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while seting user role to user !",
                error: 1,
                error_message: "Can't find user !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while seting user role to user !",
            error: 1,
            error_message: error,
        });
    });
});

export default router;