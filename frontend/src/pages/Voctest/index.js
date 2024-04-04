import React, { useState, useEffect } from 'react';
import vocabularyData from './french-english.json';
import './index.css';

function Voctest() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userChoice, setUserChoice] = useState('');
  const [vocabulary, setVocabulary] = useState([]);
  const [correctCount, setCorrectCount] = useState(0); // State to keep track of correct answers
  const MAX_QUESTIONS = 2; // Max number of questions
  let wrongWords = []; // keep track of wrong words

  const [resultText, setResultText] = useState('');
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackButton, setFeedbackButton] = useState('Next');



  useEffect(() => {
    // Convert the object into an array of [key, value] pairs
    const vocabArray = Object.entries(vocabularyData);

    // Shuffle the vocabulary array
    const shuffledVocab = shuffleArray(vocabArray);

    // Limit the number of vocabulary terms to 30
    const limitedVocab = shuffledVocab.slice(0, MAX_QUESTIONS);

    setVocabulary(limitedVocab);
  }, []);

  // const checkAnswer = () => {
  //   const nextQuestion = currentQuestion + 1;
  //   if(nextQuestion <= MAX_QUESTIONS) {
  //     const correctAnswer = vocabulary[currentQuestion][0]; // Get the key (term) of the current question
  //     const isCorrect = correctAnswer.includes(userChoice); // Check if the user's choice matches any synonym
  //     if (isCorrect) {
  //       setCorrectCount((prevCount) => prevCount + 1); // Increment correct count if answer is correct
  //       alert('Correct!');
  //     } else {
  //       wrongWords.push(vocabulary[currentQuestion]);
  //       alert(`Wrong! The correct vocabulary is: ${correctAnswer}. Your input: ${userChoice}`); // Include user input and correct answer in the alert
  //     }
  //     // setCurrentQuestion((prevCurrent) => (prevCurrent + 1) % vocabulary.length);
  //     // setUserChoice('');
  //   }
  //   else {
  //     alert(`you have reached the end of quiz! Your correction rate is: ${correctCount}/${MAX_QUESTIONS}`)
  //   }
  // };

  // called when submit is clicked
  const showAnswer = () => {
    // const resultLines = "";

    const correctAnswer = vocabulary[currentQuestion][0]; // Get the key (term) of the current question
      const isCorrect = correctAnswer.includes(userChoice); // Check if the user's choice matches any synonym
      if ((isCorrect) && !(userChoice === '')) {
        setCorrectCount((prevCount) => prevCount + 1); // Increment correct count if answer is correct
        setResultText('Correct!')
      } 
      else {
        wrongWords.push(vocabulary[currentQuestion][0]);
        setResultText(
          `Wrong! The correct vocabulary is:
          ${correctAnswer}.
          Your input: ${userChoice}`)
      }
      if (currentQuestion + 1 === MAX_QUESTIONS) {
        alert(`you have reached the end of quiz! Your correction rate is: ${correctCount}/${MAX_QUESTIONS}`)
        // this comment will appear before the resultText gets updates and displayed. 
        // setFeedbackText(`Accracy: ${Math.round(correctCount/MAX_QUESTIONS) * 100} %`);
        
        setFeedbackButton("check feedback on your vocab quiz");
      }
  
    // document.getElementById("result-section").textContent = resultText;
  }


  function printArray(wrongWords) {
    return wrongWords.join(', ')
    // if (wrongWords.length === 0) {
    //   return "there's no wrong words!"
    // }
    // else {
    //   let output = ""
    //   for (let i = 0; i < wrongWords.length; i++) {
    //     output += wrongWords[i] + (i < wrongWords.length - 1 ? ", " : ""); // Add separator between words
    //   }
    //   return output;
    // }
  }

  // called when next is clicked
  const nextQuestion = () => {
    
    if (currentQuestion + 1 === MAX_QUESTIONS) {
      setFeedbackText(
        `Accuracy: ${correctCount/MAX_QUESTIONS}
        Wrong Words: ${printArray(wrongWords)}`
        );
    }
    else{
      setCurrentQuestion((prevCurrent) => (prevCurrent + 1) % vocabulary.length);
      setUserChoice('');
      setResultText('');
    }
  }

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
          {/* <button onClick={checkAnswer}>Submit</button> */}
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
    </div>
  );
}

export default Voctest;
