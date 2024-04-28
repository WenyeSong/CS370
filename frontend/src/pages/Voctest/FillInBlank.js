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

  const config = require('../../config.json');
  const serverIP = config.serverIP;
  
  const languageIdToName = {
    6: 'Chinese',
    5: 'German',
    1: 'French',
    3: 'Spanish',
    4: 'Dutch',
  };
  

  const goBackToMainPage = () => {
    navigate('/');
  };

  useEffect(() => {
    fetchVocabulary('default');
  }, []);

  const fetchVocabulary = async () => {
    try {
      var token = localStorage.getItem('token');
      const response = await fetch(`http://${serverIP}/api/user/${token}/words`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const vocabulary = {};
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const item = data[key];
          // Assuming each item now includes 'language_id' along with 'foreign_word' and 'english_translations'
          const { foreign_word, english_translations, language_id } = item;
          // Store each term with its translations and language_id
          vocabulary[foreign_word] = { translations: english_translations, languageId: language_id };
        }
      }
      // You might need to adjust how you handle this vocabulary object further down in your application
      const vocabArray = Object.entries(vocabulary).map(([term, details]) => ({
        term,
        translations: details.translations,
        languageId: details.languageId
      }));
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
    const correctWord = vocabulary[currentQuestion].term;
    const trimmedUserChoice = userChoice.trim();
    if (trimmedUserChoice === '') {
      setFeedbackText('Please enter a word.');
      return;
    }
    const isCorrect = correctWord.toLowerCase() === trimmedUserChoice.toLowerCase();
  
    if (isCorrect) {
      setFeedbackText('Correct!');
      setCorrectCount(prevCount => prevCount + 1);
    } else {
      setFeedbackText('Wrong!');
    }
    setTimeout(() => {
      setFeedbackText('');
      nextQuestion();
    }, 500);
  };
  
  // Update how definitions are displayed
  const renderDefinition = () => {
    if (vocabulary.length > 0 && vocabulary[currentQuestion]) {
      return vocabulary[currentQuestion].translations.join(', ');
    }
    return '';
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
              {vocabulary.length > 0 && (
                <div className="question-section">
                  <div className="question-count">
                    <span>
                      {`Question ${currentQuestion + 1} / ${vocabulary.length}`}
                    </span>
                  </div>
                  <div className="question-text">
                    Definition: {vocabulary.length > 0 && vocabulary[currentQuestion] ? vocabulary[currentQuestion].translations.join(', ') : ''}
                  </div>
                  <div className="language-type">
                  {/* Displaying the language type using the languageIdToName mapping */}
                  Language: {vocabulary.length > 0 && vocabulary[currentQuestion] ? languageIdToName[vocabulary[currentQuestion].languageId] : ''}
                </div>
                </div>
              )}
              {vocabulary.length > 0 && (
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
                <p>Correct Answers: {correctCount}</p>
              </div>
              <div className="feedback-section">
                <p>{feedbackText}</p>
              </div>
            </>
          )}
        </header>
        <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
        <a href=" " download>Download Vocabulary JSON</a>
      </div>
    </div>
  );
  
}

export default Voctest;