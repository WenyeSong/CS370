import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import QuizResultPage from './QuizResultPage';

function Voctest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userChoice, setUserChoice] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [correctCount, setCorrectCount] = useState(0); 
  const [resultText, setResultText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [showResultPage, setShowResultPage] = useState(false); // State to control rendering of result page
  let wrongWords = [];

  const navigate = useNavigate();

  // Define goBackToMainPage function
  const goBackToMainPage = () => {
    navigate('/'); // Navigate to the main page
  };

  useEffect(() => {
    fetchVocabulary('default');
  }, []);

  const fetchVocabulary = async () => {
    try {
      var token = localStorage.getItem('token')
      const response = await fetch(`http://localhost:5000/user/${token}/words`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const vocabulary = {}
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const item = data[key];
          const { foreign_word, english_translations } = item;
          vocabulary[foreign_word] = english_translations;
        }
      }
      const vocabArray = Object.entries(vocabulary);
      const shuffledVocab = shuffleArray(vocabArray);
      setVocabulary(shuffledVocab);
    } catch (error) {
      console.error("Fetch error: ", error.message);
    } 
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
  
  const showAnswer = () => {
    const correctWord = vocabulary[currentQuestion][0];
    const isCorrect = correctWord === userChoice;
    if (isCorrect && !(userChoice === '')) {
      setResultText('Correct!');
      // Update correctCount here
      setCorrectCount(prevCount => prevCount + 1);
    } else {
      wrongWords.push(correctWord);
      setResultText(
        `Wrong! The correct vocabulary is:
        ${correctWord}. Your input: ${userChoice}`
      );
    }
    // Move to the next question
    nextQuestion();
  };
  
  const correctionRate = ((correctCount / Object.keys(vocabulary).length) * 100).toFixed(2);

  const nextQuestion = () => {
    if (currentQuestion + 1 === vocabulary.length) {
      setShowResultPage(true); // Show result page when last question is reached
    } else {
      setCurrentQuestion(prevCurrent => (prevCurrent + 1) % vocabulary.length);
      setUserChoice('');
      setResultText('');
    }
  };
  
  return (
    <div className="Voc_test">
      <header className="App-header">
        <h1>Vocabulary Test</h1>
        {showResultPage ? ( // Conditional rendering of result page
          <QuizResultPage correctionRate={correctionRate} />
        ) : (
          <>
            {Object.keys(vocabulary).length > 0 && (
              <div className="question-section">
                <div className="question-count">
                  <span>
                    {`Question ${currentQuestion + 1} / ${Object.keys(vocabulary).length}`}
                  </span>
                </div>
                <div className="question-text">
                  Definition: {vocabulary.length > 0 && vocabulary[currentQuestion] ? vocabulary[currentQuestion][1].join(', ') : ''}
                </div>
              </div>
            )}
            {Object.keys(vocabulary).length > 0 && (
              <div className="answer-section">
                <input
                  type="text"
                  value={userChoice}
                  onChange={handleChoiceChange}
                  placeholder="Type the word here"
                  className="definition-input"
                />
                <button onClick={showAnswer}>Submit</button>
              </div>
            )}
            <div className="result-section">
              <p>{resultText}</p>
              <p>Correct Answers: {correctCount}</p>
              <button onClick={nextQuestion}>
                {currentQuestion + 1 === Object.keys(vocabulary).length ? "Try Again" : "Next"}
              </button>
            </div>
            <div className="feedback-section">
              <p>{feedbackText}</p>
            </div>
          </>
        )}
      </header>
      <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
      <a href="http://localhost:5000/download" download>Download Vocabulary JSON</a>
    </div>
  );
}

export default Voctest;
