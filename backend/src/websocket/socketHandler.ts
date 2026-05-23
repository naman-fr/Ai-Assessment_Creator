import { Server as SocketServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { config } from "../config/env";

export function setupWebSocket(httpServer: HTTPServer): SocketServer {
  const origins = config.corsOrigin
    ? config.corsOrigin.split(",").map((o) => o.trim())
    : ["http://localhost:3000"];

  const io = new SocketServer(httpServer, {
    cors: { origin: origins, methods: ["GET", "POST"], credentials: true },
    transports: ["websocket", "polling"],
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    socket.on("join", (assignmentId: string) => {
      socket.join(assignmentId);
      console.log(`📌 Client ${socket.id} joined room: ${assignmentId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
}
