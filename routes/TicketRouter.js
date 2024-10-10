import express from "express";
import dotenv from "dotenv/config";

import {
  createTicket,
  getAllTickets,
  getTicket,
  validateTicket,
} from "../controllers/TicketController";

import { authentification } from "../middlewares/Authentification.js";
import { checkAdmin } from "../middlewares/CheckAdmin.js";
import { checkEmployee } from "../middlewares/CheckEmployee.js";

const router = express.Router();

router.post("/create", (request, response) => {
  createTicket(request.body.user, request.body.train)
    .then(() => {
      response.status(201).json({
        message: `Ticket created successfully !`,
        error: 0,
      });
    })
    .catch((error) => {
      response.status(400).json({
        message: `Something went wrong while creating a ticket !`,
        error: 1,
        error_message: error,
      });
    });
});

router.post("/get", (request, response) => {
  getAllTickets()
    .then((tickets) => {
      response.status(202).json({
        message: `Tickets fetched successfully !`,
        tickets: tickets,
        error: 0,
      });
    })
    .catch((error) => {
      response.status(404).json({
        message: `Something went wrong while fetching tickets !`,
        error: 1,
        error_message: error,
      });
    });
});

router.post("/get/:id", (request, response) => {
  getTicket(request.params.id).then((ticket) => {
    response
      .status(200)
      .json({
        message: `Ticket fetched successuflly ! `,
        ticket: ticket,
        error: 0,
      })
      .catch((error) => {
        response.status(404).json({
          message: `Something went wrong while fetching ticket !`,
          error: 1,
          error_message: error,
        });
      });
  });
});

router.post("/validate/:id", (request, response) => {
    validateTicket(request.params.id)
    .then((ticket) => {
      response.status(200).json({
        message: `Ticket fetched successfully !`,
        ticket: ticket,
        error: 0,
      });
    })
    .catch((error) => {
      response.status(404).json({
        message: `Something went wrong while validating ticket !`,
        error: 1,
        error_message: error,
      });
    });
});

export default router;
