import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      dbName: process.env.MONGO_DB || "ai_cost_intelligence",
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    console.error("Make sure MongoDB is running on:", env.mongoUri);
    console.error("\nTo start MongoDB with Docker:");
    console.error("  docker run -d -p 27017:27017 --name ai-cost-mongo mongo:7-jammy");
    console.error("\nOr if container exists but is stopped:");
    console.error("  docker start ai-cost-mongo");
    // Don't exit the process, let the app run without DB for now
    // process.exit(1);
  }
};
