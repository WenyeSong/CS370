import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../Navbar"; 

function Voctest() {
  const navigate = useNavigate();

  const handleFillInBlankClick = () => {
    navigate('/fill-in-blank');
  };

  const handleMultipleChoiceClick = () => {
    navigate('/multiple-choice');
  };

  return (
    <div className="voc_test_container">
      <Navbar />
      <div className="Voc_test">
        <header className="App-header">
          <h1>Vocabulary Test</h1>
          <button className="answer-button" onClick={handleFillInBlankClick}>Fill in the Blank</button>
          <button className="answer-button" onClick={handleMultipleChoiceClick}>Multiple Choice</button>
        </header>
      </div>
    </div>
  );
}

export default Voctest;
