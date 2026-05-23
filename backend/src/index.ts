import express from "express";
import cors from "cors";
import http from "http";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import { setupWebSocket } from "./websocket/socketHandler";
import { startWorkers, setSocketIO } from "./queue/worker";
import { errorHandler } from "./middleware/errorHandler";
import assignmentRoutes from "./routes/assignments";

async function main() {
  // Connect to MongoDB
  await connectDB();

  const app = express();
  const server = http.createServer(app);

  // Middleware
  app.use(cors({ origin: config.corsOrigin, credentials: true }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Routes
  app.use("/api/assignments", assignmentRoutes);

  // Error handler
  app.use(errorHandler);

  // WebSocket
  const io = setupWebSocket(server);
  setSocketIO(io);

  // Start workers
  startWorkers();

  // Start server
  server.listen(config.port, () => {
    console.log(`🚀 Server running on port ${config.port}`);
    console.log(`📡 WebSocket ready`);
    console.log(`🌐 CORS origin: ${config.corsOrigin}`);
  });
}

main().catch(console.error);
