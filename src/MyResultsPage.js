import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function MyResultsPage() {
  const { office } = useParams();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    //fetch("https://your-backend.onrender.com/api/db-stats")
    fetch("https://emoji-feedback.onrender.com/api/db-stats")
      .then((res) => res.json())
      .then((data) => {
        if (data[office]) {
          setStats(data[office]);
        } else {
          setStats(null); // Office not found
        }
      })
      .catch((err) => {
        console.error("Failed to fetch DB stats:", err);
      });
  }, [office]);

  // Format office name (reuse the same logic)
  function formatOfficeName(slug) {
    //const cleanedSlug = slug.replace(/[-_]*\d+$/, "");
    const cleanedSlug = slug;
    return cleanedSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  const formattedOffice = formatOfficeName(office);
	
	//<h2>Feedback Results for {formattedOffice}</h2>
	//<p>😞 Sad: {stats.sad}</p>
	//<p>😊 Happy: {stats.happy}</p>
  return (
    <div className="App">
			<h2>Feedback Results for {office}</h2>
			
      {!stats ? (
        <p>No data found for this office.</p>
      ) : (
        <div>
					<p>😡 Muy_triste: {stats.muy_triste}</p>
					<p>😞 Triste: {stats.triste}</p>
					<p>😐 Neutral: {stats.neutral}</p>
					<p>😊 Feliz: {stats.feliz}</p>
					<p>😁 Muy_feliz: {stats.muy_feliz}</p>			
				</div>
      )}
    </div>
  );
}

export default MyResultsPage;