/*
import logo from './logo.svg';
import { useState } from "react";
import './App.css';

function App() {
	const [submitted, setSubmitted] = useState(false);
  const [emoji, setEmoji] = useState(null);

  // Simulate getting office name from URL (e.g., /survey/xyz123)
  const officeName = "Barcelona Office";

  const handleClick = (face) => {
    setEmoji(face);
    setSubmitted(true);

    // Simulate sending to backend (replace this with a real API later)
    //fetch("https://your-backend.com/api/feedback", {
		//fetch("http://localhost:5000/api/feedback", {
		fetch("https://emoji-feedback.onrender.com/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        emoji: face,
        office: officeName,
        timestamp: new Date().toISOString(),
      }),
    });
  };

  return (
    <div className="App">
      {!submitted ? (
        <>
          <h2>How was your experience in {officeName}?</h2>
          <div className="emoji-buttons">
            <button onClick={() => handleClick("happy")}>😊</button>
            <button onClick={() => handleClick("neutral")}>😐</button>
            <button onClick={() => handleClick("sad")}>😞</button>
          </div>
        </>
      ) : (
        <h3>Thanks for your feedback! ({emoji})</h3>
      )}
    </div>
  );
}
*/

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SurveyPage from "./SurveyPage";
import ResultsPage from "./ResultsPage";
import MyResultsPage from "./MyResultsPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/survey/:office" element={<SurveyPage />} />
        <Route path="/results" element={<ResultsPage />} />
				<Route path="/myresults/:office" element={<MyResultsPage />} />
        {/* You can add more routes here later */}
      </Routes>
    </Router>
  );
}

export default App;
