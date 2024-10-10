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

router.post("/create", (request, response) => {
    createTrain(request.body.name, request.body.start_station, request.body.end_station, request.body.departure_time).then(() => {
        response.status(201).json({
            message: `Train created successfully !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(400).json({
            message: `Something went wrong while creating train !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get",(request, response) => {
    getAllTrains().then((trains) => {
        response.status(202).json({
            message: `Trains fetched successfully !`,
            trains: trains,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong while fetching trains !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get/:id", (request, response) => {
    getTrain(request.params.id).then((train) => {
        response.status(200).json({
            message: `Train fetched successfully !`,
            train: train,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong while fetching train !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/update/:id", authentification, (request, response) => {
    updateTrain(request.params.id, request.body.name, request.body.start_station, request.body.end_station, request.body.departure_time).then(() => {
        response.status(202).json({
            message: `Train updated successfully !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong while updating train !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/update/:id", authentification, (request, response) => {
    updateTrain(request.params.id, request.body.name, request.body.start_station, request.body.end_station, request.body.departure_time).then(() => {
        response.status(202).json({
            message: `Train ${request.params.id} updated successfully !`,
            error: 0,
        });
    }).catch(() => {
        response.status(404).json({
            message: `Something went wrong ${train} not found!`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/delete/:id", authentification, (request, response) => {
    deleteTrain(request.params.id).then(() => {
        response.status(200).json({
            message: `Train deleted successfully !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong while deleting train !`,
            error: 1,
            error_message: error,
        });
    });
});

export default router;