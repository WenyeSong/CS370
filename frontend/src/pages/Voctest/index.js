import React, { useState, useEffect } from 'react';
import vocabularyData from './french-english.json';
import './index.css';

function Voctest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userChoice, setUserChoice] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [correctCount, setCorrectCount] = useState(0); // State to keep track of correct answers
  const MAX_QUESTIONS = 30; // Max number of questions

  useEffect(() => {
    // Convert the object into an array of [key, value] pairs
    const vocabArray = Object.entries(vocabularyData);

    // Shuffle the vocabulary array
    const shuffledVocab = shuffleArray(vocabArray);

    // Limit the number of vocabulary terms to 30
    const limitedVocab = shuffledVocab.slice(0, MAX_QUESTIONS);

    setVocabulary(limitedVocab);
  }, []);

  const checkAnswer = () => {
    const correctAnswer = vocabulary[currentQuestion][0]; // Get the key (term) of the current question
    const isCorrect = correctAnswer.includes(userChoice); // Check if the user's choice matches any synonym
    if (isCorrect) {
      setCorrectCount((prevCount) => prevCount + 1); // Increment correct count if answer is correct
      alert('Correct!');
    } else {
      alert(`Wrong! The correct vocabulary is: ${correctAnswer}. Your input: ${userChoice}`); // Include user input and correct answer in the alert
    }
    setCurrentQuestion((prevCurrent) => (prevCurrent + 1) % vocabulary.length);
    setUserChoice('');
  };
  
  
  

  const handleChoiceChange = (event) => {
    setUserChoice(event.target.value);
  };

  // Function to shuffle an array
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  return (
    <div className="Voc_test">
      <header className="App-header">
        <h1>Vocabulary Test</h1>
        <div className="question-section">
          <div className="question-count">
            <span>Question {currentQuestion + 1}</span>/{MAX_QUESTIONS}
          </div>
          <div className="question-text">
            Definition: {vocabulary.length > 0 && vocabulary[currentQuestion] ? vocabulary[currentQuestion][1].join(', ') : ''}
          </div>
        </div>
        <div className="answer-section">
          <input
            type="text"
            value={userChoice}
            onChange={handleChoiceChange}
            placeholder="Type a synonym here"
            className="definition-input"
          />
          <button onClick={checkAnswer}>Submit</button>
        </div>
        <div className="result-section">
          <p>Correct Answers: {correctCount}</p>
        </div>
      </header>
    </div>
  );
}

export default Voctest;
