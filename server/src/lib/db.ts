import { connect } from "mongoose";

export const connectDB = async () => {
  try {
    const con = await connect(process.env.MONGODB_URI || "");
    console.log(`Connected to: ${con.connection.host}`);
  } catch (error: unknown) {
    console.error(error);
    process.exitCode = 1;
    throw error;
  }
};
