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

router.post("/book", authentification, (request, response) => {
    createTicket(request).then((ticket) => {
        if (ticket) {
            response.status(201).json({
                message: "Ticket booked successfully !",
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while booking ticket !",
                error: 1,
                error_message: "Can't find train or user !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while booking ticket !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get", authentification, checkEmployee, (request, response) => {
    getAllTickets().then((tickets) => {
        response.status(202).json({
            message: "Tickets fetched successfully !",
            tickets: tickets,
            error: 0,
        });
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while fetching tickets !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/get/:id", authentification, checkEmployee, (request, response) => {
    getTicket(request).then((ticket) => {
        if (ticket) {
            response.status(202).json({
                message: "Ticket fetched successuflly ! ",
                ticket: ticket,
                error: 0,
            })
        } else {
            response.status(404).json({
                message: "Something went wrong while fetching ticket !",
                error: 1,
                error_message: "Can't find ticket !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while fetching ticket !",
            error: 1,
            error_message: error,
        });
    });
});

router.post("/validate/:id", authentification, checkEmployee, (request, response) => {
    validateTicket(request).then((ticket) => {
        if (ticket) {
            response.status(202).json({
                message: "Ticket validated successfully !",
                ticket: ticket,
                error: 0,
            });
        } else {
            response.status(404).json({
                message: "Something went wrong while validating ticket !",
                error: 1,
                error_message: "Can't find ticket !",
            });
        }
    }).catch((error) => {
        response.status(500).json({
            message: "Something went wrong while validating ticket !",
            error: 1,
            error_message: error,
        });
    });
});

export default router;