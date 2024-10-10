import mongoose from "mongoose";

const User = new mongoose.model("User", new mongoose.Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	email: { type: String, required: true, unique: true },
	permission: { type: String, require: true, default: "user" },
	deletedAt: { type: Date, default: null },
}, { timestamps: true }));

export default User;