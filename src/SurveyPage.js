import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";


import "./App.css";


function formatOfficeName(slug) {
  // 1. Remove trailing numbers + dashes (e.g. "-2024", "-1")
  const cleanedSlug = slug.replace(/[-_]*\d+$/, "");
	
  return cleanedSlug
    .split("-")
    .map(word => {
      if (word.length >= 3) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      return word; // Leave short words (like "la", "uk", "hq") untouched
    })
    .join(" ");
}

	
function SurveyPage() {
  const { office } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [average, setAverage] = useState(null);
  const [votes, setVotes] = useState(null);
  const CUTOFF = 5;
	
	useEffect(() => {
    fetch("https://emoji-feedback.onrender.com/api/db-stats")
      .then(res => res.json())
      .then(data => {
        const formattedOffice = formatOfficeName(office);
        const officeData = data[formattedOffice];
				console.log("Fetched stats keys:", Object.keys(data));
				console.log("Formatted office key:", formattedOffice);
				console.log("Office data found:", officeData);
				console.log("Setting average:", adjustedAverage, "votes:", adjustedVotes);
        if (officeData) {
          const rawVotes = officeData.total_votes || 0;
          const adjustedVotes = rawVotes < CUTOFF ? rawVotes + 10 : rawVotes;
          const adjustedAverage = rawVotes < CUTOFF ? 4.0 : officeData.average_score;
					console.log("Setting average:", adjustedAverage, "votes:", adjustedVotes);
          setAverage(adjustedAverage.toFixed(1));
          setVotes(adjustedVotes);
        }
      })
      .catch(err => {
        console.error("Failed to fetch office stats:", err);
      });
  }, [office]);	

  const handleClick = (face) => {
    setEmoji(face);
    setSubmitted(true);
		
		//Para ejecutar backend en localhost
    //fetch("http://localhost:5000/api/feedback", {
		//Para ejecutar backend en RENDER 
		fetch("https://emoji-feedback.onrender.com/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emoji: face,
        office: office,
        timestamp: new Date().toISOString(),
      }),
    });
		
		// Reset after 5 seconds
		setTimeout(() => {
			setSubmitted(false);
			setEmoji(null);
		}, 5000);		
		
  };

  /*
	const capitalizedOffice = office
    ? office.charAt(0).toUpperCase() + office.slice(1)
    : "Office";
	*/
	
	const capitalizedOffice = formatOfficeName(office) ;
	
  return (
    <div className="App">
      {!submitted ? (
        <>
          <h2>¿Cómo te has sentido esta semana con {capitalizedOffice}??</h2>
          <div className="emoji-buttons">            
						<button onClick={() => handleClick("muy_feliz")}>😁</button>
						<button onClick={() => handleClick("feliz")}>😊</button>
						<button onClick={() => handleClick("neutral")}>😐</button>
						<button onClick={() => handleClick("triste")}>😞</button>
						<button onClick={() => handleClick("muy_triste")}>😡</button>
          </div>
					<p>Por favor califícanos, así podemos mejorar.</p>
					{average && (
            <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Promedio actual ({votes} votos): {average}
            </p>
          )}
				</>
      ) : (
				<>
					<h2>Gracias por tu calificación:</h2>
					<h2>[{emoji}]</h2>
					<p>Powered By SOPHIX_TOO ®</p>
				</>
      )}
    </div>
  );
}

export default SurveyPage;
