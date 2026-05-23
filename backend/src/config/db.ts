import mongoose from "mongoose";
import dns from "dns";
import { config } from "./env";

// Use Google DNS to resolve MongoDB Atlas SRV records (WSL/corporate DNS often blocks SRV)
dns.setServers(["8.8.8.8", "8.8.4.4"]);

export async function connectDB(): Promise<void> {
  const maxRetries = 5;
  for (let i = 0; i < maxRetries; i++) {
    try {
      await mongoose.connect(config.mongoUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });
      console.log("✅ MongoDB connected");
      return;
    } catch (error: any) {
      console.error(`❌ MongoDB attempt ${i + 1}/${maxRetries}:`, error.message);
      if (i < maxRetries - 1) {
        console.log(`   Retrying in ${(i + 1) * 3}s...`);
        await new Promise((r) => setTimeout(r, (i + 1) * 3000));
      }
    }
  }
  console.error("❌ MongoDB connection failed after all retries. Server starting without DB.");
}
