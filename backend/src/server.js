"use strict";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import userRoutes from "./routes/user.js";
import workoutRoutes from "./routes/workout.js";

// 👇 Add this new import line here
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// 🧩 Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 💾 MongoDB Connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || "");
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

connectDB();

// ✅ Default route
app.get("/", (req, res) => {
  res.send("🏋️‍♂️ Fitness AI Backend is running successfully!");
});

// ✅ Health check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "Fitness AI Backend is running perfectly!",
  });
});

// ✅ Routes
app.use("/api/users", userRoutes);
app.use("/api/workouts", workoutRoutes);

// 👇 Add this new route line here
app.use("/api/ai", aiRoutes);

// ⚠️ Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

export default app;
