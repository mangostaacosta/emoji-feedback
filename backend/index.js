//20250420 posgres conection
require("dotenv").config();
console.log(process.env.SUPABASE_URL); // Just for test

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

/*
const { Pool } = require("pg");

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
*/


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
	//const { emoji, office, timestamp } = req.body;
	const { emoji, office, timestamp, comment } = req.body;
	const userComment = req.body.comment;
	
	const userIp = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"];
	
	console.log("Feedback from IP:", userIp, "Device:", userAgent);

  if (!emoji || !office || !timestamp) {
    return res.status(400).json({ error: "Missing fields" });
  }
	
	//const row = `${timestamp},${office},${emoji}\n`;
	const row = `${timestamp},${office},${emoji},"${userComment || ""}"\n`;
	const filePath = path.join(__dirname, "feedback.csv");
	
	fs.appendFile(filePath, row, (err) => {
		if (err) {
			console.error("Error writing to CSV file:", err);
			return res.status(500).json({ error: "Failed to save feedback" });
		}
		console.log("Feedback saved to CSV");
//		res.status(200).json({ message: "Feedback saved" });
	});
	
	//20250420 posgres conection
	/*
	pool.query(
		"INSERT INTO feedback (timestamp, office, emoji) VALUES ($1, $2, $3)",
		[timestamp, office, emoji],
		(err, result) => {
			if (err) {
				console.error("Database error:", err);
			} else {
				console.log("Feedback also saved to database");
			}
		}
	);
	*/
	
  // Save to Supabase (no await)
	const ipUserAgent = `${userIp} | ${userAgent}`;
	
	console.log("Concat from IP:", ipUserAgent );
	
  supabase
    .from("feedback")
    .insert([
			{ 
				emoji, 
				office, 
				timestamp, 
				ip_user_agent: ipUserAgent, 
				comment: userComment?.trim() || "", 
			}
		])
    .then(({ data, error }) => {
      if (error) {
        console.error("Supabase insert error:", error);
      } else {
        console.log("Saved to Supabase:", data);
      }
    });

  console.log("Saved to Supabase:", data);
	

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


//leer el CSV
app.get("/api/emoji-stats", (req,res) => {
	const filePath = path.join(__dirname, "feedback.csv");
	const countsByOffice = {} ;
	
	try {
		/*
		const fileStream = fs.createReadStream( filePath ) ;
		const readLine = readline.createInterface({
			input: fileStream,
			crlfDelay: Infinity, 
		});
		
		for await (const line of rl) {
      const parts = line.trim().split(",");
      const [timestamp, office, emoji] = parts;
			*/
      
		const lines = fs.readFileSync(filePath, "utf-8").split("\n");

		lines.forEach((line) => {
      const parts = line.trim().split(",");
      const [timestamp, office, emoji] = parts;
			
			
			if (!emoji || !office) return;

      const normalizedOffice = office.trim();
      const normalizedEmoji = emoji.trim();

      if (!countsByOffice[normalizedOffice]) {
        countsByOffice[normalizedOffice] = { 
						muy_feliz: 0,
						feliz: 0, 
						neutral: 0, 
						triste: 0,
						muy_triste: 0,
						happy: 0,
						sad: 0,
					};
      }

      if (countsByOffice[normalizedOffice][normalizedEmoji] !== undefined) {
        countsByOffice[normalizedOffice][normalizedEmoji]++;
      }
    });
		
		console.log("countsDyOffice2 JSON ready to go");
		res.json(countsByOffice);
		
  } catch (err) {
    console.error("Error reading CSV:", err);
    res.status(500).json({ error: "Failed to read feedback data." });
  }	
});

//app.get("/api/db-stats", (req, res) => {
app.get("/api/db-stats", async (req, res) => {
	try {
    // Fetch latest feedback data
    const { data: feedbackData, error: feedbackError } = await supabase
      .from("feedback")
      .select("office, emoji, timestamp")
      .order("timestamp", { ascending: false })
      .limit(900);

    if (feedbackError) {
      console.error("Supabase query error:", feedbackError);
      return res.status(500).json({ error: "Failed to fetch feedback data." });
    }
		
		
		// Fetch mapping of office_slug → office_name
    const { data: officeMeta, error: officeError } = await supabase
      .from("tbl_office_nombres")
      .select("office_slug, office_name");

    if (officeError) {
      console.warn("Warning: could not fetch office names:", officeError.message);
    }
		
		// Create lookup map for friendly names
		const officeNameMap = {};
		 if (officeMeta) {
      officeMeta.forEach(({ office_slug, office_name }) => {
        officeNameMap[office_slug] = office_name;
      });
    }
		
	
		const emojiScores = {
			muy_triste: 1,
			triste: 2,
			neutral: 3,
			feliz: 4,
			muy_feliz: 5,
		};
		
		const countsByOffice = {};

		feedbackData.forEach(({ office, emoji, timestamp }) => {
      if (!office || !emoji) return;

      const normalizedOffice = office.trim();
      const normalizedEmoji = emoji.trim();

      if (!countsByOffice[normalizedOffice]) {
        countsByOffice[normalizedOffice] = { 
						muy_feliz: 0,
						feliz: 0, 
						neutral: 0, 
						triste: 0,
						muy_triste: 0,
						happy: 0,
						sad: 0,
						last_updated: timestamp,
						total_votes: 0,
            score_sum: 0,
            average_score: 0,
						office_name: officeNameMap[normalizedOffice] || normalizedOffice,
				};
      }

			if (countsByOffice[normalizedOffice][normalizedEmoji] !== undefined) {
				countsByOffice[normalizedOffice][normalizedEmoji]++;
				countsByOffice[normalizedOffice].total_votes++;
				countsByOffice[normalizedOffice].score_sum += emojiScores[normalizedEmoji];
			}
			
			// Update last_updated if newer timestamp is found
			const currentLatest = new Date(countsByOffice[normalizedOffice].last_updated);
			const currentTimestamp = new Date(timestamp);
			if (currentTimestamp > currentLatest) {
				countsByOffice[normalizedOffice].last_updated = timestamp;
			}
	
		});
			
		// Finalize average calculation
		Object.values(countsByOffice).forEach((officeStats) => {
			if (officeStats.total_votes > 0) {
				officeStats.average_score = officeStats.score_sum / officeStats.total_votes;
			}
			delete officeStats.score_sum; // optional cleanup
		});

		res.json(countsByOffice);
  } catch (err) {
    console.error("Unexpected error in /api/db-stats:", err);
    res.status(500).json({ error: "Internal server error." });
  }	
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});