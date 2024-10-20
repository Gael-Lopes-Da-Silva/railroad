/**
 * @swagger
 * tags:
 *   name: Trainstation
 *   description: Trainstation management
 */

import express from "express";

import {
    createTrainstation,
    getAllTrainstations,
    getTrainstation,
    updateTrainstation,
    deleteTrainstation,
} from "../controllers/TrainstationController.js";

import { authentification } from "../middlewares/Authentification.js";
import { checkAdmin } from "../middlewares/CheckAdmin.js";
import { checkEmployee } from "../middlewares/CheckEmployee.js";
import upload from '../middlewares/Uploads.js';

const router = express.Router();

/**
 * @swagger
 * /trainstations/create:
 *   post:
 *     summary: Create a new trainstation
 *     tags: [Trainstation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Name of the trainstation
 *                 example: "Strasbourg Gare Centrale"
 *               open_hour:
 *                 type: string
 *                 description: Opening hour of the trainstation
 *                 example: "08:00"
 *               close_hour:
 *                 type: string
 *                 description: Closing hour of the trainstation
 *                 example: "20:00"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image of the trainstation encoded in base64
 *                 example: "<base64 string>"
 *     responses:
 *       201:
 *         description: Trainstation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trainstation created successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       500:
 *         description: Internal server error while creating trainstation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while creating trainstation !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/create", authentification, checkAdmin, upload.single('image'), (request, response) => {
    // we try to create trainstation with the given fields in body
    createTrainstation(request).then(() => {
        response.status(201).json({
            message: "Trainstation created successfully !",
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while creating trainstation !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trainstations/get:
 *   post:
 *     summary: Retrieve all trainstations
 *     tags: [Trainstation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           description: Optional sort parameters, can include fields like name, open_hour, close_hour. Use '-' for descending order (e.g., '-name').
 *           example: "-train where - invert the sorted list"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Optional limit on the number of results to return.
 *           default: 10
 *     responses:
 *       202:
 *         description: Trainstations fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trainstations fetched successfully !"
 *                 trainstations:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the trainstation
 *                         example: "61f1f2c3e5b4c71f0d6e12ab"
 *                       name:
 *                         type: string
 *                         description: Name of the trainstation
 *                         example: "Gare Montparnasse"
 *                       open_hour:
 *                         type: string
 *                         description: Opening hour of the trainstation
 *                         example: "08:00"
 *                       close_hour:
 *                         type: string
 *                         description: Closing hour of the trainstation
 *                         example: "20:00"
 *                       image:
 *                         type: string
 *                         format: binary
 *                         description: Image of the trainstation encoded in base64
 *                         example: "<base64 string>"
 *                       deletedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Soft delete timestamp, only returns data with a null condition, others are softly deleted then
 *                         example: "2024-10-20T14:48:00Z"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       500:
 *         description: Internal server error while fetching trainstations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching trainstations !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/get", (request, response) => {
    // we try to get all trainstations
    // we can use queries like sort or limit to sort output
    getAllTrainstations(request).then((trainstations) => {
        response.status(202).json({
            message: "Trainstations fetched successfully !",
            trainstations: trainstations,
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while fetching trainstations !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trainstations/get/{id}:
 *   post:
 *     summary: Retrieve a specific trainstation by ID
 *     tags: [Trainstation]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the trainstation to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Trainstation fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trainstation fetched successfully !"
 *                 trainstation:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the trainstation
 *                       example: "61f1f2c3e5b4c71f0d6e12ab"
 *                     name:
 *                       type: string
 *                       description: Name of the trainstation
 *                       example: "Gare Montparnasse"
 *                     open_hour:
 *                       type: string
 *                       description: Opening hour of the trainstation
 *                       example: "08:00"
 *                     close_hour:
 *                       type: string
 *                       description: Closing hour of the trainstation
 *                       example: "20:00"
 *                     image:
 *                       type: string
 *                       format: binary
 *                       description: Image of the trainstation encoded in base64
 *                       example: "<base64 string>"
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Soft delete timestamp, only returns data with a null condition, others are softly deleted then
 *                       example: "2024-10-20T14:48:00Z"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find trainstation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching trainstation !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find trainstation !"
 *       500:
 *         description: Internal server error while fetching trainstation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching trainstation !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/get/:id", (request, response) => {
    // we try to get the traistation of the given id
    getTrainstation(request).then((trainstation) => {
        if (trainstation) {
            response.status(202).json({
                message: "Transtation fetched successfully !",
                trainstation: trainstation,
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while fetching trainstation !",
                error: 1,
                error_message: "Can't find trainstation !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while fetching trainstation !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trainstations/update/{id}:
 *   post:
 *     summary: Update a trainstation by ID
 *     tags: [Trainstation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the trainstation to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: New name of the trainstation
 *                 example: "New Gare Montparnasse"
 *               open_hour:
 *                 type: string
 *                 description: Opening hour of the trainstation
 *                 example: "08:00"
 *               close_hour:
 *                 type: string
 *                 description: Closing hour of the trainstation
 *                 example: "20:00"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Image of the trainstation encoded in base64
 *                 example: "<base64 string>"
 *               deletedAt:
 *                 type: string
 *                 format: date-time
 *                 description: Soft delete timestamp
 *                 example: "2024-10-20T14:48:00Z"
 *     responses:
 *       202:
 *         description: Trainstation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trainstation updated successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find trainstation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while updating trainstation !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find trainstation !"
 *       500:
 *         description: Internal server error while updating trainstation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while updating trainstation !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/update/:id", authentification, checkAdmin, (request, response) => {
    // we try to update the trainstation of the given id with the given filds in the body
    // not all fields are required !
    updateTrainstation(request).then((trainstation) => {
        if (trainstation) {
            response.status(202).json({
                message: "Trainstation updated successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while updating trainstation !",
                error: 1,
                error_message: "Can't find trainstation !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while updating trainstation !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trainstations/delete/{id}:
 *   post:
 *     summary: Delete a trainstation by ID
 *     tags: [Trainstation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the trainstation to delete
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Trainstation deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trainstation deleted successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find trainstation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deleting trainstation !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find trainstation !"
 *       500:
 *         description: Internal server error while deleting trainstation
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deleting trainstation !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/delete/:id", authentification, checkAdmin, (request, response) => {
    // try to delete user of the given id
    deleteTrainstation(request).then((trainstation) => {
        if (trainstation) {
            response.status(202).json({
                message: "Trainstation deleted successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while deleting trainstation !",
                error: 1,
                error_message: "Can't find trainstation !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while deleting trainstation !",
            error: 1,
            error_message: error,
        });
    });
});

export default router;
