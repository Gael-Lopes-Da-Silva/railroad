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

export async function getAllTickets() {
    return await TicketModel.find({ validateAt: null });
}

export async function getTicket(request) {
    return await TicketModel.findById(request.params.id);
}

export async function validateTicket(request) {
    return await TicketModel.findByIdAndUpdate(request.params.id, {
        validateTicket: Date.now(),
    });
}
