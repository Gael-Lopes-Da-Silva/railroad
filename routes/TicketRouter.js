/**
 * @swagger
 * tags:
 *    name: Ticket
 *    description: Ticket management
 */
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

/**
 * @swagger
 * /tickets/book:
 *   post:
 *     summary: Book a new ticket for a user and a train
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID of the user booking the ticket
 *                 example: "61f1f2c3e5b4c71f0d6e12ab"
 *               trainId:
 *                 type: string
 *                 description: ID of the train for the ticket
 *                 example: "61f1f2c3e5b4c71f0d6e12ac"
 *     responses:
 *       201:
 *         description: Ticket booked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket booked successfully !"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find train or user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while booking ticket !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find train or user !"
 *       500:
 *         description: Internal server error while booking ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while booking ticket !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
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

/**
 * @swagger
 * /tickets/get:
 *   post:
 *     summary: Retrieve all tickets
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       202:
 *         description: Tickets fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Tickets fetched successfully !"
 *                 tickets:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                         description: Unique identifier for the ticket
 *                         example: "61f1f2c3e5b4c71f0d6e12ab"
 *                       user:
 *                         type: string
 *                         description: ID of the user associated with the ticket
 *                         example: "61f1f2c3e5b4c71f0d6e12ac"
 *                       train:
 *                         type: string
 *                         description: ID of the train associated with the ticket
 *                         example: "61f1f2c3e5b4c71f0d6e12ad"
 *                       validatedAt:
 *                         type: string
 *                         format: date-time
 *                         description: Date and time the ticket was validated
 *                         example: "2023-01-01T10:00:00Z"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       500:
 *         description: Internal server error while fetching tickets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching tickets !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
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

/**
 * @swagger
 * /tickets/get/{id}:
 *   post:
 *     summary: Retrieve a specific ticket by ID
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the ticket to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Ticket fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket fetched successfully !"
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the ticket
 *                       example: "61f1f2c3e5b4c71f0d6e12ab"
 *                     user:
 *                       type: string
 *                       description: ID of the user associated with the ticket
 *                       example: "61f1f2c3e5b4c71f0d6e12ac"
 *                     train:
 *                       type: string
 *                       description: ID of the train associated with the ticket
 *                       example: "61f1f2c3e5b4c71f0d6e12ad"
 *                     validatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time the ticket was validated
 *                       example: "2023-01-01T10:00:00Z"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching ticket !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find ticket !"
 *       500:
 *         description: Internal server error while fetching ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while fetching ticket !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
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

/**
 * @swagger
 * /tickets/validate/{id}:
 *   post:
 *     summary: Validate a ticket by ID
 *     tags: [Ticket]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the ticket to validate
 *         schema:
 *           type: string
 *     responses:
 *       202:
 *         description: Ticket validated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Ticket validated successfully !"
 *                 ticket:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       description: Unique identifier for the ticket
 *                       example: "61f1f2c3e5b4c71f0d6e12ab"
 *                     user:
 *                       type: string
 *                       description: ID of the user associated with the ticket
 *                       example: "61f1f2c3e5b4c71f0d6e12ac"
 *                     train:
 *                       type: string
 *                       description: ID of the train associated with the ticket
 *                       example: "61f1f2c3e5b4c71f0d6e12ad"
 *                     validatedAt:
 *                       type: string
 *                       format: date-time
 *                       description: Date and time the ticket was validated
 *                       example: "2023-01-01T10:00:00Z"
 *                 error:
 *                   type: integer
 *                   example: 0
 *       404:
 *         description: Cannot find ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while validating ticket !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: string
 *                   example: "Can't find ticket !"
 *       500:
 *         description: Internal server error while validating ticket
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong while validating ticket !"
 *                 error:
 *                   type: integer
 *                   example: 1
 *                 error_message:
 *                   type: object
 *                   example: ...
 */
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