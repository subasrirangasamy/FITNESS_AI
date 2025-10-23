import mongoose from "mongoose";

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  workoutType: String,
  duration: Number,
  caloriesBurned: Number,
  date: { type: Date, default: Date.now },
});

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;  // ✅ Must use export default
