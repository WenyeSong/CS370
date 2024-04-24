import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';
import QuizResultPage from './QuizResultPage';
import { Navbar } from "../Navbar"; 

function Voctest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [vocabulary, setVocabulary] = useState([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [showResultPage, setShowResultPage] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchVocabulary();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  const goBackToMainPage = () => {
    navigate('/');
  };

  async function getrandom(language_id) {
    const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/words/${language_id}`, {method: 'GET'});
    let data = await response.json();
    return data;
  }

  async function prepareVocabulary(data, language_id) {
    const vocabularyPromises = data.map(async item => {
      const randomWords = await getrandom(language_id);
      const choices = shuffleArray([item.foreign_word, ...randomWords]);
      return {
        question: item.english_translations.join(', '), 
        correctAnswer: item.foreign_word,
        choices
      };
    });
  
    return Promise.all(vocabularyPromises);
  }

  const fetchVocabulary = async () => {
    try {
      var token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/user/${token}/words`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const language_id = 1;
      const data = await response.json();
      var vocabulary = data.map(item => ({
        question: item.english_translations.join(', '), // Assuming there's always at least one translation
        correctAnswer: item.foreign_word, // Store the correct answer
      }));
      setVocabulary(vocabulary);
    } catch (error) {
      console.error("Fetch error: ", error.message);
    }
  };
  
  const [choices, setChoices] = useState([]);

  useEffect(() => {
    if (vocabulary.length > 0) {
      getchoices(vocabulary[currentQuestion].correctAnswer, 1); // Assuming language_id is 1 for example
    }
  }, [currentQuestion, vocabulary]);

  const getchoices = async (correctAnswer, language_id) => {
    var random = await getrandom(language_id);
    random.push(correctAnswer);
    var shuffledChoices = shuffleArray(random);
    setChoices(shuffledChoices); // Update state with the shuffled choices
  };


  const handleChoiceChange = (choice) => {
    const correctWord = vocabulary[currentQuestion].correctAnswer; // Directly use the correct answer from the vocabulary
    const isCorrect = correctWord === choice;
    setFeedbackText(isCorrect ? 'Correct!' : 'Wrong!');
    if (isCorrect) {
      setCorrectCount(prevCount => prevCount + 1);
    }
    setTimeout(() => {
      setFeedbackText('');
      nextQuestion();
    }, 500);
  };
  
  

  const nextQuestion = () => {
    if (currentQuestion + 1 === vocabulary.length) {
      setShowResultPage(true);
    } else {
      setCurrentQuestion(current => (current + 1) % vocabulary.length);
    }
  };

  return (
    <div className="voc_test_container">
      <Navbar/>
      <div className="Voc_test">
        <header className="App-header">
          <h1>Vocabulary Test</h1>
          {showResultPage ? (
            <QuizResultPage correctionRate={`${(correctCount / vocabulary.length * 100).toFixed(2)}%`} />
          ) : (
            <>
              {vocabulary.length > 0 && (
                <div className="question-section">
                  <span>{`Question ${currentQuestion + 1} / ${vocabulary.length}`}</span>
                  <div className="question-text">
                    {vocabulary[currentQuestion].question}  {/* Display the question from vocabulary */}
                  </div>
                  <div className="answer-section">
                  {choices.map((choice, index) => (
                    <button key={index} onClick={() => handleChoiceChange(choice)}>
                      {choice}
                    </button>
                  ))}
                </div>
                  
                </div>
              )}
              <div className="feedback-section">
                <p>{feedbackText}</p>
              </div>
            </>
          )}
        </header>
        <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
        <a href="${process.env.REACT_APP_BACKEND_URL}/download" download>Download Vocabulary JSON</a>
      </div>
    </div>
  );
                    }  

export default Voctest;
