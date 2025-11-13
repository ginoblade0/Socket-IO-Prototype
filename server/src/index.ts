import express from "express";
import dotenv from "dotenv";

import authRouter from "./routes/auth.route";
import { connectDB } from "./lib/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
  connectDB();
});
