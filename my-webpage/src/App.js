import React, { useState } from 'react';
import './App.css';

function App() {
  // Sample vocabulary data
  const vocabulary = [
    { word: 'meticulous', definition: 'Showing great attention to detail; very careful and precise.' },
    { word: 'vivacious', definition: 'Attractively lively and animated.' },
    { word: 'obstinate', definition: 'Stubbornly refusing to change opinion or chosen course of action.' },
    // Add more words as needed
  ];

  // State to keep track of the current question index and user's choice
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userChoice, setUserChoice] = useState('');

  // Function to check the user's answer
  const checkAnswer = () => {
    alert(userChoice === vocabulary[currentQuestion].definition ? 'Correct!' : 'Wrong!');
    // Move to the next question
    setCurrentQuestion((prevCurrent) => (prevCurrent + 1) % vocabulary.length);
    // Reset user choice
    setUserChoice('');
  };

  // Handle user input
  const handleChoiceChange = (event) => {
    setUserChoice(event.target.value);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Vocabulary Test</h1>
        <div className="question-section">
          <div className="question-count">
            <span>Question {currentQuestion + 1}</span>/{vocabulary.length}
          </div>
          <div className="question-text">{vocabulary[currentQuestion].word}</div>
        </div>
        <div className="answer-section">
          <input
            type="text"
            value={userChoice}
            onChange={handleChoiceChange}
            placeholder="Type the definition here"
            className="definition-input"
          />
          <button onClick={checkAnswer}>Submit</button>
        </div>
      </header>
    </div>
  );
}

export default App;
