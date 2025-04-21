import { useParams } from "react-router-dom";
import { useState } from "react";
import "./App.css";

function SurveyPage() {
  const { office } = useParams();
  const [submitted, setSubmitted] = useState(false);
  const [emoji, setEmoji] = useState(null);

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
		}, 3000);		
		
  };

  const capitalizedOffice = office
    ? office.charAt(0).toUpperCase() + office.slice(1)
    : "Office";

  return (
    <div className="App">
      {!submitted ? (
        <>
          <h2>Por favor califica tu experiencia hoy en {capitalizedOffice}?</h2>
          <div className="emoji-buttons">
            <button onClick={() => handleClick("happy")}>😊</button>
            <button onClick={() => handleClick("neutral")}>😐</button>
            <button onClick={() => handleClick("sad")}>😞</button>
          </div>
        </>
      ) : (
				<>
					<h3>Gracias por tu calificación!</h3>
					<h3>({emoji})</h3>
					<h3>En 3 segundos podras volver a calificarnos</h3>
				</>
      )}
    </div>
  );
}

export default SurveyPage;
