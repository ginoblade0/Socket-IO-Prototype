import http from "http";
import express from "express";
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
  },
});

export function getReceiverSocketId(userId: string) {
  return userSocketMap[userId];
}

const userSocketMap: Record<string, string> = {};

io.on("connection", (socket: Socket) => {
  console.log("User connected.", socket.id);

  const userId = socket.handshake.query.userId as string;

  if (userId) userSocketMap[userId] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("User disconnected.", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
