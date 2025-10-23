// backend/algorithms/fitnessAI.js

export function getWorkoutRecommendation(userData) {
  // pretend we have logic to suggest workouts
  if (userData.goal === "weight_loss") {
    return "Do 30 mins of cardio and light strength training 💪";
  } else if (userData.goal === "muscle_gain") {
    return "Focus on heavy lifting and high protein intake 🏋️‍♂️";
  } else {
    return "Do a mix of cardio and flexibility exercises 🧘‍♂️";
  }
}
