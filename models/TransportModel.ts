import mongoose from "mongoose";

const TransportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    speed: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    isAvailable: {
      type: Boolean,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

const Transport =
  mongoose.models.Transport || mongoose.model("Transport", TransportSchema);

export default Transport;
