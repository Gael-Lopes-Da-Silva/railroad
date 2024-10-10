import mongoose, { Schema } from "mongoose";

const Train = new mongoose.model("Train", new mongoose.Schema({
	name: { type: String, required: true },
	start_station: { type: Schema.Types.ObjectId, ref: "Trainstation", required: true },
	end_station: { type: Schema.Types.ObjectId, ref: "Trainstation", required: true },
	departure_time: { type: Date, required: true },
	deletedAt: { type: Date, default: null },
}, { timestamps: true }));

export default Train;