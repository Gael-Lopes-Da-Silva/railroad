import mongoose from "mongoose";

const Trainstation = new mongoose.model("Trainstation", new mongoose.Schema({
    name: { type: String, required: true },
    open_hour: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // match strings like "12:45"
    },
    close_hour: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, // match strings like "12:45"
    },
    image: { type: Buffer, required: true }, // a base64 string
    deletedAt: { type: Date, default: null }, // soft delete
}, { timestamps: true }));

export default Trainstation;
