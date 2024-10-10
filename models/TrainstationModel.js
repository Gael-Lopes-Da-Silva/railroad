import mongoose from "mongoose";

const Trainstation = new mongoose.model("Trainstation", new mongoose.Schema({
	name: { type: String, required: true },
	open_hour: { type: Date, required: true },
	close_hour: { type: Date, required: true },
	image: { type: Buffer, required: true },
	deletedAt: { type: Date, default: null },
}, { timestamps: true }));

export default Trainstation;