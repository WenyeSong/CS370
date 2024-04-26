import React from 'react';
import { useNavigate } from 'react-router-dom';

const QuizResultPage = ({ correctionRate }) => {
  const navigate = useNavigate();

  const tryAgain = () => {
    navigate('/Voctest'); // Redirect the user back to the quiz page
    window.location.reload(); 
  };

  return (
    <div>
      <h2>Quiz Result</h2>
      <p>Correction Rate: {correctionRate}%</p>
      <p>You have reached the end of the quiz!</p>
      <button className="answer-button" onClick={tryAgain}>Try Again</button>
    </div>
  );
};

export default QuizResultPage;
