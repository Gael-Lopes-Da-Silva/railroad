/**
 * @swagger
 * tags:
 *   name: Trainstation
 *   description: Trainstation managment
 */

import express from "express";
import dotenv from "dotenv/config";

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

const router = express.Router();

router.post("/create", (request, response) => {
    createTrainstation(request.body.name, request.body.open_hour, request.body.close_hour, request.body.image).then(() => {
        response.status(201).json({
            message: `Trainstation created successfully !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(400).json({
            message: `Something went wrong while creating trainstation !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get", (request, response) => {
    getAllTrainstations().then((trainstations) => {
        response.status(202).json({
            message: `Trainstations fetched successfully !`,
            trainstations: trainstations,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong while fetching trainstations !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get/:id", (request, response) => {
    getTrainstation(request.params.id)
    .then((trainstation) => {
        response.status(200).json({
            message: `Transtation fetched successfully !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong while fetching trainstation !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/update/:id", (request, response) => {
    updateTrainstation(request.params.id, request.body.name, request.body.open_hour, request.body.close_hour,request.body.image).then(() => {
        response.status(202).json({
            message: `Trainstation updated successfully !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong while updating trainstation !`,
            error: 1,
            error_message: error,
        });
    });
});

router.post("/delete/:id", (request, response) => {
    deleteTrainstation(request.params.id).then(() => {
        response.status(200).json({
            message: `Trainstation deleted successfully !`,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: `Something went wrong while deleting trainstation !`,
            error: 1,
            error_message: error,
        });
    });
});

export default Trainstation;
