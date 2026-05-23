import express from "express";
import cors from "cors";
import http from "http";
import path from "path";
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
  const allowedOrigins = config.corsOrigin
    ? config.corsOrigin.split(",").map((o) => o.trim())
    : ["http://localhost:3000"];
  app.use(cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || allowedOrigins.includes("*")) {
        callback(null, true);
      } else {
        callback(null, true); // Allow all in dev, restrict in prod if needed
      }
    },
    credentials: true,
  }));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use("/uploads", express.static(path.join(__dirname, "..", config.uploadsDir)));

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

  // Start server — bind to 0.0.0.0 for Render/Docker
  const host = "0.0.0.0";
  server.listen(config.port, host, () => {
    console.log(`🚀 Server running on ${host}:${config.port}`);
    console.log(`📡 WebSocket ready`);
    console.log(`🌐 CORS origins: ${allowedOrigins.join(", ")}`);
  });
}

main().catch(console.error);
