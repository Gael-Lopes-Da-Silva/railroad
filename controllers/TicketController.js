import TicketModel from "../models/TicketModel.js";
import TrainModel from "../models/TrainModel.js";
import UserModel from "../models/UserModel.js";

export async function createTicket(request) {
    const user = UserModel.findById(request.body.user, { deletedAt: null });
    const train = TrainModel.findById(request.body.train, { deletedAt: null });
    
    if (!user || !train) {
        return null;
    }
    
    return await TicketModel.create({
        user: request.body.user,
        train: request.body.train,
    });
}

export async function getAllTickets(request) {
    const sortQuery = request.query.sort ? request.query.sort.split(',') : [];
    const limitQuery = request.query.limit ? parseInt(request.query.limit) : 10;
    let tickets = TicketModel.find({ validateAt: null });

    if (sortQuery.length > 0) {
        let sortOptions = [];

        sortQuery.forEach((element) => {
            let sortOrder = 1;

            if (element.startsWith('-')) {
                sortOrder = -1;
                element = element.substring(1);
            }

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
    return await TicketModel.findById(request.params.id);
}

export async function validateTicket(request) {
    return await TicketModel.findByIdAndUpdate(request.params.id, {
        validateTicket: Date.now(),
    });
}
