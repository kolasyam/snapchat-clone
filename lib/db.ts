import mongoose, { Connection } from "mongoose";
let cachedConnection: Connection | null = null;
export async function connectToMongoDB() {
  if (cachedConnection) {
    console.log("using cached MONGODB connection");
    return cachedConnection;
  }
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL as string);
    cachedConnection = conn.connection;
    console.log("new mongodb connection is established");
    return cachedConnection;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
