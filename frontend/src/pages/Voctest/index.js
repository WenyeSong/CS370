import React, { useState, useEffect } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

function Voctest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userChoice, setUserChoice] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [correctCount, setCorrectCount] = useState(0); // State to keep track of correct answers
  const MAX_QUESTIONS = 30; // Max number of questions
  const navigate = useNavigate(); // Define navigate function
  let wrongWords = []; // keep track of wrong words

  const [resultText, setResultText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackButton, setFeedbackButton] = useState('Next');


  // Define goBackToMainPage function
  const goBackToMainPage = () => {
    navigate('/'); // Navigate to the main page
  };

  useEffect(() => {
    // Fetch vocabulary data from the backend when the component mounts
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
      // Iterate over the data array and populate the dictionary
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          const item = data[key];
          const { foreign_word, english_translations } = item;
      
          // Add the foreign word and its translations to the dictionary
          vocabulary[foreign_word] = english_translations;
        }
      }
      //console.log(vocabulary);
      const vocabArray = Object.entries(vocabulary);
      const shuffledVocab = shuffleArray(vocabArray);
      const limitedVocab = shuffledVocab.slice(0, MAX_QUESTIONS);
      //console.log(limitedVocab);
      setVocabulary(limitedVocab);
      if(limitedVocab.length()< MAX_QUESTIONS){
        MAX_QUESTIONS = limitedVocab.length()
      }
    } catch (error) {
      console.error("Fetch error: ", error.message);
    } 
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


  
  const showAnswer = () => {
    const correctWord = vocabulary[currentQuestion][0]; // Get the correct foreign word
    const isCorrect = correctWord === userChoice; // Check if the user's choice matches the correct word
    if (isCorrect && !(userChoice === '')) {
      setCorrectCount(prevCount => prevCount + 1); // Increment correct count if answer is correct
      setResultText('Correct!');
    } else {
      wrongWords.push(correctWord);
      setResultText(
        `Wrong! The correct vocabulary is:
        ${correctWord}. Your input: ${userChoice}`
      );
    }

    setCurrentQuestion((prevCurrent) => (prevCurrent + 1) % vocabulary.length);
    setUserChoice('');

    if (currentQuestion + 1 === MAX_QUESTIONS) {
      alert(`You have reached the end of the quiz! Your correction rate is: ${correctCount}/${MAX_QUESTIONS}`);
      setFeedbackText(
        `Accuracy: ${(correctCount / MAX_QUESTIONS) * 100}%
        Wrong Words: ${wrongWords.join(', ')}`
      );
      setFeedbackButton("Check feedback on your vocab quiz");
    }
  }
    

  

  const nextQuestion = () => {
    if (currentQuestion + 1 === MAX_QUESTIONS) {
      // Display overall feedback and wrong words if it's the last question
      setFeedbackText(
        `Accuracy: ${(correctCount / MAX_QUESTIONS) * 100}%
        Wrong Words: ${wrongWords.join(', ')}`
      );
    } else {
      setCurrentQuestion(prevCurrent => (prevCurrent + 1) % Object.keys(vocabulary).length);
      setUserChoice('');
      setResultText('');
    }
  }


  return (
    <div className="Voc_test">
      <header className="App-header">
        <h1>Vocabulary Test</h1>
        <div className="question-section">
          <div className="question-count">
            <span>Question {currentQuestion + 1}</span>/{Object.keys(vocabulary).length}
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
          <button onClick={showAnswer}>Submit</button>
        </div>

        <div className="result-section">
          <p>{resultText}</p>
          <p>Correct Answers: {correctCount}</p>
          <button onClick={nextQuestion}>{feedbackButton}</button>
        </div>
        {/*the following section gives overall feedback and let the user see the wrong wordlist.*/}
        <div className="feedback-section">
          <p>{feedbackText}</p>
        </div>
      </header>
      <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
      <a href="http://localhost:5000/download" download>Download Vocabulary JSON</a>
    </div>
  );
}

export default Voctest;
