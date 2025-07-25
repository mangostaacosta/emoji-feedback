
import { useEffect, useState } from "react";

function ResultsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    //fetch("https://emoji-feedback.onrender.com/api/emoji-stats")
    fetch("https://emoji-feedback.onrender.com/api/db-stats")
      .then((res) => res.json())
			.then((data) => {
				console.log("Fetched data:", data); //  Now inside scope
				setStats(data);
			})
      .catch((err) => {
        console.error("Failed to fetch DB stats:", err);
      });
			
  }, []);

	

	const emojiLabels = [
    { key: "muy_triste", label: "Muy Triste 😡" },
    { key: "triste", label: "Triste 😞" },
    { key: "neutral", label: "Neutral 😐" },
    { key: "feliz", label: "Feliz 😊" },
    { key: "muy_feliz", label: "Muy Feliz 😁" },
		{ key: "sad", label: "Sad" },
		{ key: "happy", label: "Happy" }
  ];

  return (
    <div className="App">
      <h2>Emoji Feedback by Office</h2>
      {!stats ? (
        <p>Loading...</p>
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: "800px", margin: "2rem auto" }}>
          <thead>
            <tr>
              <th style={{ borderBottom: "2px solid #ccc", textAlign: "left", padding: "0.5rem" }}>Office</th>
              {emojiLabels.map(({ key, label }) => (
                <th key={key} style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>{label}</th>
              ))}
							<th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Ultimo Update</th>
							<th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Promedio</th>
							<th style={{ borderBottom: "2px solid #ccc", padding: "0.5rem" }}>Conteo</th>
            </tr>
          </thead>
          <tbody>
						{Object.entries(stats)
							.sort(([, a], [, b]) => new Date(b.last_updated) - new Date(a.last_updated))
							.map(([office, counts]) => {
								const adjustedVotes = counts.total_votes || 0;
                const average = counts.average_score || 0;
							
							return (
              <tr key={office}>
                <td style={{ borderBottom: "1px solid #eee", fontWeight: "bold", padding: "0.5rem" }}>{office}</td>
                {emojiLabels.map(({ key }) => (
                  <td key={key} style={{ textAlign: "center", padding: "0.5rem" }}>{counts[key] || 0}</td>
                ))}
								<td style={{ textAlign: "center", padding: "0.5rem" }}>{counts.last_updated || "—"}</td>
								<td style={{ textAlign: "center", padding: "0.5rem" }}>{average.toFixed(1)}</td>
								<td style={{ textAlign: "center", padding: "0.5rem" }}>{adjustedVotes}</td>
              </tr>
            );
						})}
          </tbody>
        </table>
      )}
    </div>
  );

}

export default ResultsPage;