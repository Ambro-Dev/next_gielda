import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;
const DB_NAME = process.env.DB_NAME as string;

let connection: typeof mongoose;

const dbConnect = async () => {
  if (!connection) {
    connection = await mongoose.connect(MONGODB_URI, {
      dbName: DB_NAME,
    });
  }
  return connection;
};

export default dbConnect;
