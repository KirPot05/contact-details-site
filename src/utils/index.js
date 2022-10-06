import mongoose from "mongoose";
import records from "../models/record.js";

export function dbConnect() {
  const mongoConnectUrl = process.env.MONGO_URL;
  mongoose
    .connect(mongoConnectUrl)
    .then(() => {
      console.log("Database connected");
    })
    .catch((err) => console.log(err));
}

export async function getNextSequenceValue() {
  let sequenceDocument = await records.findByIdAndUpdate(
    "633d3816a3cb58b1f4f2f433",
    { $inc: { token: 1 } }
  );
  return sequenceDocument.token;
}
