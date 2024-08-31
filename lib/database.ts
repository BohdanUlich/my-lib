import mongoose from "mongoose";

export const connectDb = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_DB_URI}`);
  } catch (err) {
    console.error("Connection database error", err);
  }
};
