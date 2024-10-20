import mongoose from "mongoose";

import TicketModel from "../models/TicketModel.js";
import TrainModel from "../models/TrainModel.js";
import UserModel from "../models/UserModel.js";

export async function createTicket(request) {
    // we check if the user id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(request.body.user)) {
        return null;
    }

    // we check if the train id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(request.body.train)) {
        return null;
    }
    
    const user = await UserModel.findById(request.body.user, null, { deletedAt: null });
    const train = await TrainModel.findById(request.body.train, null, { deletedAt: null });
    
    // we get and check if the user and the train are valid (exists, not deleted, and active)
    if (!user || !train) {
        return null;
    }
    
    // we create the ticket with the given body fields
    return await TicketModel.create({
        user: request.body.user,
        train: request.body.train,
    });
}

export async function getAllTickets(request) {
    const sortQuery = request.query.sort ? request.query.sort.split(',') : []; // we get the sort query if set
    const limitQuery = request.query.limit ? parseInt(request.query.limit) : 10; // we get the limit query if set
    let tickets = TicketModel.find(); // we get all the tickets

    if (sortQuery.length > 0) {
        let sortOptions = [];

        sortQuery.forEach((element) => {
            let sortOrder = 1;

            // we change the order of the sort if there is a - in front of the parameter
            if (element.startsWith('-')) {
                sortOrder = -1;
                element = element.substring(1);
            }

            // we check the following parameters
            if (["name", "start_station", "end_station", "departure_time", "active"].includes(element)) {
                sortOptions.push([element, sortOrder]);
            }
        });

        if (sortOptions.length > 0) {
            tickets.sort(sortOptions);
        }
    }

    if (limitQuery > 0) {
        tickets.limit(limitQuery);
    }
    
    return await tickets;
}

export async function getTicket(request) {
    // we check if the id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        return null;
    }
    
    // we get the ticket of the given id
    return await TicketModel.findById(request.params.id);
}

export async function validateTicket(request) {
    // we check if the id is a valid mongoose id
    if (!mongoose.Types.ObjectId.isValid(request.params.id)) {
        return null;
    }
    
    // we validate the ticket of the given id with the current date
    return await TicketModel.findByIdAndUpdate(request.params.id, {
        validateTicket: Date.now(),
    });
}
