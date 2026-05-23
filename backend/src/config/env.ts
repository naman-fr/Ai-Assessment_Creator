import dotenv from "dotenv";
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/vedaai",
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: parseInt(process.env.REDIS_PORT || "6379", 10),
    password: process.env.REDIS_PASSWORD || undefined,
  },
  geminiApiKey: process.env.GEMINI_API_KEY || "",
  corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000",
  uploadsDir: process.env.UPLOADS_DIR || "./uploads",
};
