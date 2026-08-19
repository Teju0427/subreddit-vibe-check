import "dotenv/config";
import express from "express";
import cors from "cors";
import subredditRoutes from "./routes/subreddit.routes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    mockMode: process.env.USE_MOCK_DATA === "true",
  });
});

app.use("/api/subreddit", subredditRoutes);

// 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: "NOT_FOUND", message: "Route not found." });
});

app.use(errorHandler);

app.listen(PORT, () => {
  const mockMode = process.env.USE_MOCK_DATA === "true";
  console.log(`Subreddit Vibe Check API listening on port ${PORT}`);
  console.log(`Mode: ${mockMode ? "MOCK DATA (development)" : "LIVE Reddit API"}`);
});
