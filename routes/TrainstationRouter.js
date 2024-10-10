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

router.post("/create", authentification, checkAdmin, (request, response) => {
    createTrainstation(request).then(() => {
        response.status(201).json({
            message: "Trainstation created successfully !",
            error: 0,
        });
    }).catch((error) => {
        response.status(400).json({
            message: "Something went wrong while creating trainstation !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get", (request, response) => {
    getAllTrainstations().then((trainstations) => {
        response.status(202).json({
            message: "Trainstations fetched successfully !",
            trainstations: trainstations,
            error: 0,
        });
    }).catch((error) => {
        response.status(404).json({
            message: "Something went wrong while fetching trainstations !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get/:id", (request, response) => {
    getTrainstation(request).then((trainstation) => {
        if (trainstation) {
            response.status(200).json({
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
        response.status(404).json({
            message: "Something went wrong while fetching trainstation !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/update/:id", authentification, checkAdmin, (request, response) => {
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
        response.status(404).json({
            message: "Something went wrong while updating trainstation !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/delete/:id", authentification, checkAdmin, (request, response) => {
    deleteTrainstation(request).then((trainstation) => {
        if (trainstation) {
            response.status(200).json({
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
        response.status(404).json({
            message: "Something went wrong while deleting trainstation !",
            error: 1,
            error_message: error,
        });
    });
});

export default router;
