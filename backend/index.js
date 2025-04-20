const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Simulated storage (we'll replace with a real DB later)
let feedbackData = [];

app.post("/api/feedback", (req, res) => {
  const { emoji, office, timestamp } = req.body;

  if (!emoji || !office || !timestamp) {
    return res.status(400).json({ error: "Missing fields" });
  }

  feedbackData.push({ emoji, office, timestamp });
  console.log("Received feedback:", { emoji, office, timestamp });
  res.status(200).json({ message: "Feedback saved" });
});

app.get("/api/feedback", (req, res) => {
  res.json(feedbackData);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});