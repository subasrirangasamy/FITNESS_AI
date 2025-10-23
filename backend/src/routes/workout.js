import express from "express";
import Workout from "../models/Workout.js";

const router = express.Router();

// 🏋️ Add a new workout
router.post("/", async (req, res) => {
  try {
    const workout = await Workout.create(req.body);
    res.status(201).json(workout);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 📋 Get all workouts for a specific user
router.get("/:userId", async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.params.userId });
    res.status(200).json(workouts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
