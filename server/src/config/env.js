import dotenv from "dotenv";
dotenv.config({ path: "../.env" });

export const env = {
  PORT: process.env.PORT || 8000,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/ghosttactoe",
  JWT_SECRET: process.env.JWT_SECRET || "change-me-in-production-use-a-64-char-random-string",
  JWT_EXPIRE: process.env.JWT_EXPIRE || "24h",
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
  NODE_ENV: process.env.NODE_ENV || "development",
};
