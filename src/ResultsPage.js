
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
              <p>😊 Happy: {counts.happy}</p>
              <p>😐 Neutral: {counts.neutral}</p>
              <p>😞 Sad: {counts.sad}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}


export default ResultsPage;