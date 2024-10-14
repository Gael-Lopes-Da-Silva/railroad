import mongoose, { Schema } from "mongoose";

const Ticket = new mongoose.model("Ticket", new mongoose.Schema({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true }, // link to user
    train: { type: Schema.Types.ObjectId, ref: "Train", required: true }, // link to train
    validatedAt: { type: Date, default: null },
}, { timestamps: true }));

export default Ticket;
