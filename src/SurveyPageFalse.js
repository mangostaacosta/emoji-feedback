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
  const MAXTEXT = 33;
	const CUTOFF = 6;
	const TEXTINPUT = false; // Toggle this to false to disable comment box and require only one click
	
	const { office } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [emoji, setEmoji] = useState(null);
  const [average, setAverage] = useState(null);
  const [votes, setVotes] = useState(null);
	const [comment, setComment] = useState("");
	
	useEffect(() => {
    fetch("https://emoji-feedback.onrender.com/api/db-stats")
      .then(res => res.json())
      .then(data => {
        				
				const formattedOffice = formatOfficeName(office);
				const officeData = data[office];
				/*
				console.log("Fetched data:", data);
				console.log("Fetched stats keys:", Object.keys(data));
				console.log("Formatted office key:", formattedOffice);
				console.log("Office data found:", officeData);
				*/
        if (officeData) {
          const rawVotes = officeData.total_votes || 0;
          const adjustedVotes = rawVotes < CUTOFF ? rawVotes + 10 : rawVotes;
          const adjustedAverage = rawVotes < CUTOFF ? 3.9 : officeData.average_score;
					console.log("Setting average:", adjustedAverage, "votes:", adjustedVotes);
          setAverage(adjustedAverage.toFixed(1));
          setVotes(adjustedVotes);
        }
      })
      .catch(err => {
        console.error("Failed to fetch office stats:", err);
      });
  }, [office]);	

  const handleEmojiSelect = (face) => {
    setEmoji(face);
		if (!TEXTINPUT) {
      handleSubmit(face, "");
    }
  };
	
	
  const handleSubmit = () => {
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
        emoji,
        office,
        timestamp: new Date().toISOString(),
        comment: comment.trim(),
      }),
    });

    setTimeout(() => {
      setSubmitted(false);
      setEmoji(null);
      setComment("");
    }, 5000);
  };


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
		
		//average = average + 1 ; //ensayo RMA
		
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
          <h2>¿Cómo te has sentido esta semana con {capitalizedOffice}?</h2>
          <div className="emoji-buttons">            
						<button onClick={() => handleEmojiSelect("muy_triste")}>😡</button>
						<button onClick={() => handleEmojiSelect("triste")}>😞</button>
						<button onClick={() => handleEmojiSelect("neutral")}>😐</button>
						<button onClick={() => handleEmojiSelect("feliz")}>😊</button>
						<button onClick={() => handleEmojiSelect("muy_feliz")}>😁</button>
          </div>
					{average && (
            <p style={{ marginTop: "1rem", fontWeight: "bold" }}>
              Promedio actual: {average}, votos durante la semana: {votes}
            </p>
          )}
					<p>Por favor califícanos, así podemos mejorar!</p>
					
					{/* Textarea appears after emoji is chosen */}
					{/* Textarea solo aparece cuando está activo el parametro */}
					{emoji && TEXTINPUT && (
						<>
							<textarea
								placeholder="Usa hasta 3 palabras para explicar tu voto"
								value={comment}
								onChange={(e) => {
									if (e.target.value.length <= MAXTEXT) {
										setComment(e.target.value);
									}
								}}
								cols={35}
								rows={1}
                style={{ resize: "none", overflow: "hidden" }}
							/>
							<p>{comment.length} / {MAXTEXT} caracteres</p>
							<button onClick={handleSubmit}>Enviar</button>
						</>
					)}
				</>
      ) : (
				<>
					<h2>Gracias por tu calificación:({emoji})</h2>
					<h3>Mañana tu voto se verá reflejado en las estadísticas</h3>
					<p>Powered By SOPHIX_TOO ®</p>
				</>
      )}
    </div>
  );
}

export default SurveyPage;
