import TicketModel from "../models/TicketModel.js";

export async function createTicket(user, train) {
  await TicketModel.createTicket({
    user: user,
    train: train,
  });
}

export async function getAllTickets() {
  const tickets = await TicketModel.find({ validateAt: null });
  return tickets;
}

export async function getTicket(id) {
  const ticket = await TicketModel.findById(id);
  return ticket;
}

export async function validateTicket(id) {
  const ticket = await TicketModel.findByIdAndUpdate(id, {
    validateTicket: Date.now(),
  });
}
