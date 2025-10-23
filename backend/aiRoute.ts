import express from "express";
const router = express.Router();

// Our AI “brain” - very simple
router.post("/recommend", (req, res) => {
  const { goal } = req.body;

  let recommendation = "";

  if (goal === "weight_loss") {
    recommendation = "🏃‍♂️ Run 30 mins + eat more veggies!";
  } else if (goal === "muscle_gain") {
    recommendation = "🏋️ Lift weights + eat more protein!";
  } else {
    recommendation = "🧘‍♀️ Stay active + eat healthy!";
  }

  res.json({ recommendation });
});

export default router;
