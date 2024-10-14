import mongoose from "mongoose";

const User = new mongoose.model("User", new mongoose.Schema({
    pseudo: { type: String, unique: true },
    email: { type: String, unique: true },
    password: { type: String },
    role: { type: String, default: "user" }, // permissions
    deletedAt: { type: Date, default: null }, // soft delete
}, { timestamps: true }));

export default User;