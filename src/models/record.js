import mongoose from "mongoose";

const recordSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    token: {
      type: Number,
      required: true,
      unique: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("records", recordSchema);
