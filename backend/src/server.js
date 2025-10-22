"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// import mongoose from "mongoose"; // Uncomment when using MongoDB
// import { Pool } from "pg"; // Uncomment when using PostgreSQL
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// 🧩 Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});
// 🚀 Start the server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
exports.default = app;
//# sourceMappingURL=server.js.map