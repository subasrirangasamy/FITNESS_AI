import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import mongoose from "mongoose"; // Uncomment when using MongoDB
// import { Pool } from "pg"; // Uncomment when using PostgreSQL

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 💾 Database Connection (optional - for later)
// Example:
// mongoose.connect("mongodb://localhost:27017/fitness-ai")
//   .then(() => console.log("✅ MongoDB connected"))
//   .catch(err => console.error("❌ MongoDB connection error:", err));

// ✅ Default route (this fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.send("🏋️‍♂️ Fitness AI Backend is running successfully!");
});

// ✅ Health check API (for testing)
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Fitness AI Backend is running perfectly!",
  });
});

// ⚠️ Error handling (optional but good)
app.use(
  (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
  }
);

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
