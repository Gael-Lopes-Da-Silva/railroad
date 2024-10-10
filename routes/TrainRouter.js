import express, { response } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config";

import {
    createTrain,
    getAllTrains,
    getTrain,
    updateTrain,
    deleteTrain,
} from "../controllers/TrainController.js";

import { authentification } from "../middlewares/Authentification.js";

const router = express.Router();

// Train creation
router.post("/", (request, response) => {
    createTrain(request.body.name, request.body.start_station, request.body.end_station, request.body.departure_time).then(() => {
        response.status(201).json({
            message: `Train ${request.body.name} created successfull`,
            error: 0,
        });
    }).catch((error) => {
        response.status(400).json({
            message: `Something get wrong cannot create that train`,
            error: 1,
            error_message: error,
        });
    });
});

// Get all trains
router.post("/get",(request, response) => {
    getAllTrains().then((trains) => {
        response.status(202).json({
            message: `Trains data : ${trains} !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong ${trains} not found!`,
            error: 1,
            error_message: error,
        });
    });
});

// Get one train by ID
router.post("/get/:id", (request, response) => {
    getTrain(request.params.id).then((train) => {
        response.status(200).json({
            message: `Your train data : ${train}`,
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

// Update a train
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

// Delete one train by ID
router.post("/delete/:id", authentification, (request, response) => {
    deleteTrain(request.params.id).then(() => {
        response.status(200).json({
            message: `Train ${train.params.id} delete successfully !`,
            error: 0,
        });
    }).catch(() => {
        response.status(404).json({
            message: `Train ${train.params.id} not found!`,
            error: 1,
            error_message: error,
        });
    });
});

export default Train;
