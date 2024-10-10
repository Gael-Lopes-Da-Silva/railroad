import mongoose from "mongoose";

const User = new mongoose.model("User", new mongoose.Schema({
	pseudo: { type: String, required: true, unique: true },
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	role: { type: String, default: "user" },
	deletedAt: { type: Date, default: null },
}, { timestamps: true }));

export default User;