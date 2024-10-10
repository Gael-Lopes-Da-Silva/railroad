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
    getAllUsers,
    login,
} from "../controllers/UserController.js";

import { authentification } from "../middlewares/Authentification.js";
import { checkAdmin } from "../middlewares/CheckAdmin.js";
import { checkEmployee } from "../middlewares/CheckEmployee.js";

const router = express.Router();

router.post("/register", (request, response) => {
    createUser(request.body.pseudo, request.body.email, request.body.password).then(() => {
        response.status(201).json({
            message: `User registered successfully !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(400).json({
            message: `Something went wrong while registering user !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/login", (request, response) => {
    login(request.body.email, request.body.password).then((user) => {
        if (user) {
            const secret = process.env.SECRET;
            const token = jsonwebtoken.sign({ id: user.id }, secret, { expiresIn: "24h" });

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
        response.status(404).json({
            message: "Something went wrong while logging user !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get", (request, response) => {
    getAllUsers().then((users) => {
        response.status(200).json({
            message: "Users fetched successfully !",
            users: users,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: "Something went wrong while fetching users !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get/:id", (request, response) => {
    getUser(request.params.id).then((user) => {
        if (user) {
            response.status(200).json({
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
        response.status(404).json({
            message: "Something went wrong while fetching user !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/update/:id", (request, response) => {
    updateUser(request.params.id, request.body.pseudo, request.body.email, request.body.password).then(() => {
        response.status(202).json({
            message: "User updated successfully !",
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: "Something went wrong while updating user !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/delete/:id", (request, response) => {
    deleteUser(request.params.id).then(() => {
        response.status(202).json({
            message: "User deleted successfully !",
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: "Somehting went wrong while deleting user !",
            error: 1,
            error_message: error,
        });
    });
});

export default router;