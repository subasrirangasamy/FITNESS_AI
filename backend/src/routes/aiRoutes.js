import express from "express";
import { getWorkoutRecommendation } from "../algorithms/fitnessAI.js";

const router = express.Router();

router.post("/recommend", (req, res) => {
  const userData = req.body;
  const recommendation = getWorkoutRecommendation(userData);
  res.json({ recommendation });
});

export default router;
