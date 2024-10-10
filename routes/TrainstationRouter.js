import express, { response } from "express";
import jsonwebtoken from "jsonwebtoken";
import dotenv from "dotenv/config";

import {
  createTrainstation,
  updateTrainstation,
  getAllTrainstations,
  getTrainstation,
  deleteTrainstation,
} from "../controllers/TrainstationController.js";

import { authentification } from "../middlewares/Authentification.js";

const router = express.Router();

// Trainstation creation
router.post("/"),
  authentification,
  (request, response) => {
    createTrainstation(
      request.body.name,
      request.body.open_hour,
      request.body.close_hour,
      request.body.image
    )
      .then(() => {
        response.status(201).json({
          message: `Trainstation ${request.body.name} created successfull`,
          error: 0,
        });
      })
      .catch((error) => {
        response.status(400).json({
          message: `Something get wrong cannot create trainstation`,
          error: 1,
          error_message: error,
        });
      });
  };

// Update a trainstation
router.post("/update/:id", authentification, (request, response) => {
  updateTrainstation(
    request.params.id,
    request.params.name,
    request.params.start_station,
    request.params.end_station,
    request.params.departure_time
  ).then(() => {
    response
      .status(202)
      .json({
        message: `Trainstation ${request.params.id} updated successfully !`,
        error: 0,
      })
      .catch(() => {
        response.status(404).json({
          message: `Something went wrong ${trainstation} not found!`,
          error: 1,
          error_message: error,
        });
      });
  });
});

// Get all trainstations
router.post("/get"),
  authentification,
  (request, response) => {
    getAllTrainstations()
      .then((trainstation) => {
        response.status(202).json({
          message: `Trainstations data : ${trainstation} !`,
          error: 0,
        });
      })
      .catch((error) => {
        response.status(404).json({
          message: `Something went wrong ${trainstation} not found!`,
          error: 1,
          error_message: error,
        });
      });
  };

// Get one trainstation by ID
router.post("/get/:id", (request, response) => {
    getTrainstation(request.params.id)
    .then((trainstation) => {
      response.status(200).json({
        message: `Trainstation data : ${trainstation}`,
        error: 0,
      });
    })
    .catch(() => {
      response.status(404).json({
        message: `Something went wrong ${trainstation} not found!`,
        error: 1,
        error_message: error,
      });
    });
});

// Delete one trainstation by ID
router.post("/delete/:id", authentification, (request, response) => {
    deleteTrainstation(request.params.id)
      .then(() => {
        response.status(200).json({
          message: `Trainstation ${trainstation.params.id} delete successfully !`,
          error: 0,
        });
      })
      .catch(() => {
        response.status(404).json({
          message: `Train ${trainstation.params.id} not found!`,
          error: 1,
          error_message: error,
        });
      });
  });

export default Trainstation;
