import express from "express";
import cors from "cors";
import { createServer } from "http";
import path from "path";
import { fileURLToPath } from "url";
import { env } from "./config/env.js";
import { connectDB } from "./config/db.js";
import apiRouter from "./routes/index.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { setupSocket } from "./socket/handlers.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

app.use(cors({ origin: env.CLIENT_URL === "*" ? "*" : env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use("/api", apiRouter);

// Serve client build in production
const clientDist = path.join(__dirname, "..", "..", "client", "dist");
if (env.NODE_ENV === "production") {
  app.use(express.static(clientDist));
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api") && !req.path.startsWith("/socket.io")) {
      res.sendFile(path.join(clientDist, "index.html"));
    }
  });
}

app.use(errorHandler);

const httpServer = createServer(app);
setupSocket(httpServer);

async function start() {
  await connectDB();
  httpServer.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
}

start();
