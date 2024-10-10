import mongoose, { Schema } from "mongoose";

const Ticket = new mongoose.model(
  "Ticket",
  new mongoose.Schema(
    {
      user: { type: Schema.Types.ObjectId, ref: "User", required: true },
      train: { type: Schema.Types.ObjectId, ref: "Train", required: true },
      validatedAt: { type: Date, default: null },
    },
    { timestamps: true }
  )
);

export default Ticket;
