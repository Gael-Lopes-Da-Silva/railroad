import TicketModel from "../models/TicketModel.js";

export async function createTicket(request) {
    await TicketModel.create({
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
