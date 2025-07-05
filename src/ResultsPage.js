
import { useEffect, useState } from "react";


/*// version antigua para leer desde el CSV
function ResultsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    //fetch("https://your-backend.onrender.com/api/emoji-stats")
    fetch("https://emoji-feedback.onrender.com/api/emoji-stats")
      .then((res) => res.json())
      .then((data) => setStats(data));
  }, []);

  return (
    <div className="App">
      <h2>Emoji Feedback by Office</h2>
      {!stats ? (
        <p>Loading...</p>
      ) : (
        Object.entries(stats).map(([office, counts]) => (
          <div key={office} style={{ marginBottom: "1.5rem" }}>
            <h3>📍 {office}</h3>
            <ul>
              <li>😊 Happy: {counts.happy}</li>
              <li>😐 Neutral: {counts.neutral}</li>
              <li>😞 Sad: {counts.sad}</li>
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
*/

function ResultsPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    //fetch("https://emoji-feedback.onrender.com/api/emoji-stats")
    fetch("https://emoji-feedback.onrender.com/api/db-stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => {
        console.error("Failed to fetch DB stats:", err);
      });
  }, []);

	const emojiLabels = [
    { key: "very_sad", label: "😡" },
    { key: "sad", label: "😞" },
    { key: "neutral", label: "😐" },
    { key: "happy", label: "😊" },
    { key: "very_happy", label: "😁" },
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
            </tr>
          </thead>
          <tbody>
            {Object.entries(stats).map(([office, counts]) => (
              <tr key={office}>
                <td style={{ borderBottom: "1px solid #eee", fontWeight: "bold", padding: "0.5rem" }}>{office}</td>
                {emojiLabels.map(({ key }) => (
                  <td key={key} style={{ textAlign: "center", padding: "0.5rem" }}>{counts[key] || 0}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

/* versión que sacaba los resultados en html sencillo
  return (
    <div className="App">
      <h2>Emoji Feedback by Office</h2>
      {!stats ? (
        <p>Loading...</p>
      ) : (
        Object.entries(stats).map(([office, counts]) => (
          <div key={office} style={{ marginBottom: "1.5rem" }}>
            <h3>📍 {office}</h3>
            <div>
							<p>😡 Muy_triste: {counts.muy_triste}</p>
							<p>😞 Triste: {counts.triste}</p>
							<p>😐 Neutral: {counts.neutral}</p>
							<p>😊 Feliz: {counts.feliz}</p>
							<p>😁 Muy_feliz: {counts.muy_feliz}</p>
              <p>😞 Sad: {counts.sad}</p>
							<p>😊 Happy: {counts.happy}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
*/

}

export default ResultsPage;