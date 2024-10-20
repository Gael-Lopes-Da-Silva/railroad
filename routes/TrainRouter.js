/**
 * @swagger
 * tags:
 *   name: Train
 *   description: Train managment
 */

import express from "express";

import {
    createTrain,
    getAllTrains,
    getTrain,
    updateTrain,
    deleteTrain,
    activateTrain,
    deactivateTrain,
} from "../controllers/TrainController.js";

import { authentification } from "../middlewares/Authentification.js";
import { checkAdmin } from "../middlewares/CheckAdmin.js";
import { checkEmployee } from "../middlewares/CheckEmployee.js";

const router = express.Router();

/**
 * @swagger
 * /trains/create:
 *   post:
 *     summary: Create a new train
 *     tags: [Train]
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
 *                 description: The name of the train
 *                 example: "Express Train"
 *               start_station:
 *                 type: string
 *                 description: Object ID of the starting station
 *                 example: "61f1f2c3e5b4c71f0d6e12ac"
 *               end_station:
 *                 type: string
 *                 description: Object ID of the destination station
 *                 example: "61f1f2c3e5b4c71f0d6e12ad"
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *                 description: The departure time for the train
 *                 example: "2023-01-01T09:00:00Z"
 *               active:
 *                 type: boolean
 *                 description: The active status of the train
 *                 example: true
 *     responses:
 *       201:
 *         description: Train created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Train created successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Bad request due to invalid or deleted stations
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while creating train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Start station or end station invalid or deleted !"
 *       500:
 *         description: Internal server error while creating train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while creating train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/create", authentification, checkAdmin, (request, response) => {
    // we try to create the train with the given body fields
    createTrain(request).then((train) => {
        if (train) {
            response.status(201).json({
                message: "Train created successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while creating train !",
                error: 1,
                error_message: "Start station or end station invalid or deleted !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while creating train !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trains/get:
 *   post:
 *     summary: Retrieve all trains
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *           description: Optional sort parameters, can include fields like name, start_station, end_station, departure_time, active. Use '-' for descending order (e.g., '-name').
 *           example: "-departure_time where - invert the sorted list"
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           description: Optional limit on the number of results to return.
 *           example: 10 by default, can be changed (min 1)
 *     responses:
 *       202:
 *         description: Trains fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Trains fetched successfully !"
 *                 trains:
 *                   type: array
 *                   description: List of all trains
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the train
 *                         example: "61f1f2c3e5b4c71f0d6e12ab"
 *                       name:
 *                         type: string
 *                         description: Name of the train
 *                         example: "Express Train"
 *                       start_station:
 *                         type: string
 *                         description: Object ID of the starting station
 *                         example: "61f1f2c3e5b4c71f0d6e12ac"
 *                       end_station:
 *                         type: string
 *                         description: Object ID of the destination station
 *                         example: "61f1f2c3e5b4c71f0d6e12ad"
 *                       departure_time:
 *                         type: string
 *                         format: date-time
 *                         description: Departure time of the train
 *                         example: "2023-01-01T09:00:00Z"
 *                       active:
 *                         type: boolean
 *                         description: Indicates if the train is active
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         description: Creation date of the train record
 *                         example: "2022-12-01T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Last update date of the train record
 *                         example: "2022-12-01T12:00:00Z"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       500:
 *         description: Internal server error while fetching trains
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching trains !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: {}
 */
router.post("/get",(request, response) => {
    // we try to get all the trains
    // we can use queries like sort or limit to sort output
    getAllTrains(request).then((trains) => {
        response.status(202).json({
            message: "Trains fetched successfully !",
            trains: trains,
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while fetching trains !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trains/get/{id}:
 *   post:
 *     summary: Retrieve a specific train by ID
 *     tags: [Train]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the train to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Train fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Train fetched successfully !"
 *                 train:
 *                   type: object
 *                   description: Details of the fetched train
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the train
 *                       example: "61f1f2c3e5b4c71f0d6e12ab"
 *                     name:
 *                       type: string
 *                       description: Name of the train
 *                       example: "Express Train"
 *                     start_station:
 *                       type: string
 *                       description: Object ID of the starting station
 *                       example: "61f1f2c3e5b4c71f0d6e12ac"
 *                     end_station:
 *                       type: string
 *                       description: Object ID of the destination station
 *                       example: "61f1f2c3e5b4c71f0d6e12ad"
 *                     departure_time:
 *                       type: string
 *                       format: date-time
 *                       description: Departure time of the train
 *                       example: "2023-01-01T09:00:00Z"
 *                     active:
 *                       type: boolean
 *                       description: Indicates if the train is active
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       description: Creation date of the train record
 *                       example: "2022-12-01T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Last update date of the train record
 *                       example: "2022-12-01T12:00:00Z"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find train !"
 *       500:
 *         description: Internal server error while fetching train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/get/:id", (request, response) => {
    // we try to get the train with the given id
    getTrain(request).then((train) => {
        if (train) {
            response.status(202).json({
                message: "Train fetched successfully !",
                train: train,
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while fetching train !",
                error: 1,
                error_message: "Can't find train !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while fetching train !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trains/update/{id}:
 *   post:
 *     summary: Update train details by ID
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the train to update
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
 *                 description: The name of the train
 *                 example: "Express Train"
 *               start_station:
 *                 type: string
 *                 description: ID of the starting station
 *                 example: "61f1f2c3e5b4c71f0d6e12ab"
 *               end_station:
 *                 type: string
 *                 description: ID of the destination station
 *                 example: "61f1f2c3e5b4c71f0d6e12ac"
 *               departure_time:
 *                 type: string
 *                 format: date-time
 *                 description: The departure time for the train
 *                 example: "2023-01-01T09:00:00Z"
 *               active:
 *                 type: boolean
 *                 description: Whether the train is active
 *                 example: true
 *     responses:
 *       202:
 *         description: Train updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Train updated successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while updating train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find that train !"
 *       500:
 *         description: Internal server error while updating train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while updating train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/update/:id", authentification, checkAdmin, (request, response) => {
    // we try to update the train with the given id and body fields
    // not all fields are required !
    updateTrain(request).then((train) => {
        if (train) {
            response.status(202).json({
                message: "Train updated successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while updating train !",
                error: 1,
                error_message: "Can't find that train !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while updating train !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trains/delete/{id}:
 *   post:
 *     summary: Delete train by ID
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the train to delete
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Train deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Train deleted successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deleting train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find train !"
 *       500:
 *         description: Internal server error while deleting train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deleting train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/delete/:id", authentification, checkAdmin, (request, response) => {
    // we try to delete the train of the given id
    deleteTrain(request).then((train) => {
        if (train) {
            response.status(202).json({
                message: "Train deleted successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while deleting train !",
                error: 1,
                error_message: "Can't find train !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while deleting train !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trains/set/activate/{id}:
 *   post:
 *     summary: Activate a specific train by ID
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the train to activate
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Train activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Train activated successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while activating train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find train !"
 *       500:
 *         description: Internal server error while activating train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while activating train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/set/activate/:id", authentification, checkAdmin, (request, response) => {
    // we try to activate the train of the given id
    // do nothing if the train is already activated
    activateTrain(request).then((train) => {
        if (train) {
            response.status(202).json({
                message: "Train activated successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while activating train !",
                error: 1,
                error_message: "Can't find train !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while activating train !",
            error: 1,
            error_message: error,
        });
    });
});

/**
 * @swagger
 * /trains/set/deactivate/{id}:
 *   post:
 *     summary: Deactivate a specific train by ID
 *     tags: [Train]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the train to deactivate
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Train deactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Train deactivated successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deactivating train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find train !"
 *       500:
 *         description: Internal server error while deactivating train
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while deactivating train !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
router.post("/set/deactivate/:id", authentification, checkAdmin, (request, response) => {
    // we try to deactivate the train of the given id
    // do nothing if the train is already deactivated
    deactivateTrain(request).then((train) => {
        if (train) {
            response.status(202).json({
                message: "Train deactivated successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while deactivating train !",
                error: 1,
                error_message: "Can't find train !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while deactivating train !",
            error: 1,
            error_message: error,
        });
    });
});

export default router;
