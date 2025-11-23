import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRouter from "./routes/auth.route";
import messageRouter from "./routes/message.route";

import { connectDB } from "./lib/db";

dotenv.config();

const app = express();
const PORT = process.env.PORT;

// app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    // methods: ["GET", "POST", "PUT", "OPTIONS"],
    // allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/messages", messageRouter);

app.listen(PORT, () => {
  console.log(`Running on port ${PORT}`);
  connectDB();
});
