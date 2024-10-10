import mongoose from "mongoose";

const Trainstation = new mongoose.model(
  "Trainstation",
  new mongoose.Schema(
    {
      name: { type: String, required: true },
      open_hour: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
      close_hour: { type: Date, required: true },
      close_hour: {
        type: String,
        required: true,
        match: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
      },
      image: { type: Buffer, required: true },
      deletedAt: { type: Date, default: null },
    },
    { timestamps: true }
  )
);

export default Trainstation;
