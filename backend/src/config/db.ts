import mongoose from "mongoose";
import dns from "dns";
import { config } from "./env";

// Use Google DNS for SRV resolution (needed for some environments like WSL)
// Only override if the default DNS can't resolve Atlas SRV records
const originalServers = dns.getServers();
try {
  dns.setServers(["8.8.8.8", "8.8.4.4", ...originalServers]);
} catch {
  // If setting fails, continue with default DNS
}

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
