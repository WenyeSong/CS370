import React, { useState, useEffect } from 'react';
import './index.css';

function Voctest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userChoice, setUserChoice] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const MAX_QUESTIONS = 30;

  useEffect(() => {
    // Fetch vocabulary data from the backend when the component mounts
    fetchVocabulary('default'); // Fetch the default dictionary initially
  }, []);

  const fetchVocabulary = (dictionary) => {
    // Fetch vocabulary data from the backend using the specified dictionary
    // Replace the URL with your backend API endpoint
    fetch(`http://your-backend-api-url/${dictionary}`)
      .then(response => response.json())
      .then(data => {
        // Convert the object into an array of [key, value] pairs
        const vocabArray = Object.entries(data);

        // Shuffle the vocabulary array
        const shuffledVocab = shuffleArray(vocabArray);

        // Limit the number of vocabulary terms to 30
        const limitedVocab = shuffledVocab.slice(0, MAX_QUESTIONS);

        // Update the vocabulary state
        setVocabulary(limitedVocab);
      })
      .catch(error => console.error('Error fetching vocabulary:', error));
  };

  const handleDictionaryChange = (event) => {
    const selectedDictionary = event.target.value;
    fetchVocabulary(selectedDictionary); // Fetch vocabulary data when the dictionary selection changes
  };

  const checkAnswer = () => {
    const correctAnswer = vocabulary[currentQuestion][0];
    const isCorrect = correctAnswer.includes(userChoice);
    if (isCorrect) {
      setCorrectCount(prevCount => prevCount + 1);
      alert('Correct!');
    } else {
      alert(`Wrong! The correct vocabulary is: ${correctAnswer}. Your input: ${userChoice}`);
    }
    setCurrentQuestion(prevCurrent => (prevCurrent + 1) % vocabulary.length);
    setUserChoice('');
  };

  const handleChoiceChange = (event) => {
    setUserChoice(event.target.value);
  };

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
        <div className="dictionary-select">
          <label htmlFor="dictionary">Select a dictionary: </label>
          <select id="dictionary" onChange={handleDictionaryChange}>
            <option value="default">Default Dictionary</option>
            {/* Add more options for different dictionaries */}
          </select>
        </div>
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
            placeholder="Type the word here"
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
