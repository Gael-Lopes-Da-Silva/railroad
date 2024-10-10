/**
 * @swagger
 * tags:
 *   name: Train
 *   description: Train managment
 */

import express from "express";
import dotenv from "dotenv/config";

import {
    createTrain,
    getAllTrains,
    getTrain,
    updateTrain,
    deleteTrain,
} from "../controllers/TrainController.js";

import { authentification } from "../middlewares/Authentification.js";
import { checkAdmin } from "../middlewares/CheckAdmin.js";
import { checkEmployee } from "../middlewares/CheckEmployee.js";

const router = express.Router();

router.post("/create", authentification, checkAdmin, (request, response) => {
    createTrain(request).then(() => {
        response.status(201).json({
            message: "Train created successfully !",
            error: 0,
        });
    }).catch((error) => {
        response.status(400).json({
            message: "Something went wrong while creating train !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get",(request, response) => {
    getAllTrains().then((trains) => {
        response.status(202).json({
            message: "Trains fetched successfully !",
            trains: trains,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: "Something went wrong while fetching trains !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get/:id", (request, response) => {
    getTrain(request).then((train) => {
        if (train) {
            response.status(200).json({
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
        response.status(404).json({
            message: "Something went wrong while fetching train !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/update/:id", authentification, checkAdmin, (request, response) => {
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
                error_message: "Can't find train !",
            });
        }
    }).catch((error) => {
        response.status(404).json({
            message: "Something went wrong while updating train !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/delete/:id", authentification, checkAdmin, (request, response) => {
    deleteTrain(request).then((train) => {
        if (train) {
            response.status(200).json({
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
        response.status(404).json({
            message: "Something went wrong while deleting train !",
            error: 1,
            error_message: error,
        });
    });
});

export default router;
