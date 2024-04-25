import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import QuizResultPage from './QuizResultPage';
import { Navbar } from "../Navbar"; 

function Voctest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userChoice, setUserChoice] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResultPage, setShowResultPage] = useState(false);
  const [feedbackText, setFeedbackText] = useState(''); // State to control feedback text

  const navigate = useNavigate();

  const goBackToMainPage = () => {
    navigate('/');
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
    const trimmedUserChoice = userChoice.trim();
    if (trimmedUserChoice === '') {
      setFeedbackText('Please enter a word.');
      return;
    }
    const isCorrect = correctWord === trimmedUserChoice;

    if (isCorrect) {
      setFeedbackText('Correct!');
      setCorrectCount(prevCount => prevCount + 1);
    } else {
      setFeedbackText('Wrong!');
    }
    setTimeout(() => {
      setFeedbackText('');
      nextQuestion();
    }, 500); // Hide feedback after 0.5 seconds
  };

  const correctionRate = ((correctCount / Object.keys(vocabulary).length) * 100).toFixed(2);

  const nextQuestion = () => {
    if (currentQuestion + 1 === vocabulary.length) {
      setShowResultPage(true);
    } else {
      setCurrentQuestion(prevCurrent => (prevCurrent + 1) % vocabulary.length);
      setUserChoice('');
    }
  };

  return (
    <div className="voc_test_container">
      <Navbar/>
    

    <div className="Voc_test">
      <header className="App-header">
        <h1>Vocabulary Test</h1>
        {showResultPage ? (
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
                <button className="answer-button" onClick={showAnswer}>Submit</button>
              </div>
            )}
            <div className="result-section">
              <p>Correct Answers: {correctCount}</p >
            </div>
            <div className="feedback-section">
              <p>{feedbackText}</p >
            </div>
          </>
        )}

      </header>
      <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
      <a href=" " download>Download Vocabulary JSON</a >

    </div>
    </div>
  );
}

export default Voctest;