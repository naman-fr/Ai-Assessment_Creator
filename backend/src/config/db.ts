import mongoose from "mongoose";
import { config } from "./env";

export async function connectDB(): Promise<void> {
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 15000,
        connectTimeoutMS: 15000,
        socketTimeoutMS: 45000,
      });
      console.log("✅ MongoDB connected");
      return;
    } catch (error: any) {
      console.error(`❌ MongoDB attempt ${i + 1}/${maxRetries}:`, error.message);
      if (i < maxRetries - 1) {
        const delay = (i + 1) * 3000;
        console.log(`   Retrying in ${delay / 1000}s...`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }
  console.error("❌ MongoDB connection failed after all retries. Server starting without DB.");
}
