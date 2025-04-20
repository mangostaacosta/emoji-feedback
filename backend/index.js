const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

const fs = require("fs");
const path = require("path");

app.use(cors());
app.use(express.json());

// Simulated storage (we'll replace with a real DB later)
let feedbackData = [];

app.post("/api/feedback", (req, res) => {
	const { emoji, office, timestamp } = req.body;

  if (!emoji || !office || !timestamp) {
    return res.status(400).json({ error: "Missing fields" });
  }
	
	const row = `${timestamp},${office},${emoji}\n`;
	const filePath = path.join(__dirname, "feedback.csv");
	
	fs.appendFile(filePath, row, (err) => {
		if (err) {
			console.error("Error writing to CSV file:", err);
			return res.status(500).json({ error: "Failed to save feedback" });
		}
		console.log("Feedback saved to CSV");
//		res.status(200).json({ message: "Feedback saved" });
	});

  feedbackData.push({ emoji, office, timestamp });
  console.log("Received feedback:", { emoji, office, timestamp });
  res.status(200).json({ message: "Feedback saved" });
});
/*
app.get("/api/feedback", (req, res) => {
  res.json(feedbackData);
});
*/
// Route to download the CSV
app.get("/api/export", (req, res) => {
  const filePath = path.join(__dirname, "feedback.csv");
  res.download(filePath, "feedback.csv");
});



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});