import mongoose, { Schema } from "mongoose";

const Train = new mongoose.model("Train", new mongoose.Schema({
    name: { type: String, required: true },
    start_station: { type: Schema.Types.ObjectId, ref: "Trainstation", required: true }, // link to start trainstation
    end_station: { type: Schema.Types.ObjectId, ref: "Trainstation", required: true }, // link to end trainstation
    departure_time: { type: Date, required: true },
    active: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }, // soft delete
}, { timestamps: true }));

export default Train;