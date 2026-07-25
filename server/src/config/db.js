import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDB() {
  try {
    await mongoose.connect(env.MONGO_URI);
    console.log(`[MongoDB] Connected to ${env.MONGO_URI}`);
  } catch (err) {
    console.warn(`[MongoDB] Connection failed: ${err.message}. Operating in in-memory fallback mode.`);
  }
}


