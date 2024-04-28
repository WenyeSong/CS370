import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { Button, Form } from 'antd'; // Import Button from antd for styling
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../Navbar"; 

export default function FlashcardPage() {

  const config = require('../../config.json');
  const serverIP = config.serverIP;

  const [flashcards, setFlashcards] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState('');
  const [dictionaries, setDictionaries] = useState({});
  const [languageId, setLanguageId] = useState();
  const amountEl = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [successMessage, setSuccessMessage] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const dictionaryToLanguageId = {
    'Chinese': 6,
    'German': 5,
    'French': 1,
    'Spanish': 3,
    'Dutch': 4
  };

    // Define goBackToMainPage function
    const goBackToMainPage = () => {
      navigate('/');
    };
      
  useEffect(() => {
    if (selectedDictionary) {
      const newLanguageId = dictionaryToLanguageId[selectedDictionary];
      setLanguageId(newLanguageId);
      console.log('Selected Dictionary:', selectedDictionary, 'Language ID:', newLanguageId);
    }
  }, [selectedDictionary]);


  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        const responseGerman = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dict/german-english.json');
        const germanDictionary = await responseGerman.json();
        const responseFrench = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dict/french-english.json');
        const frenchDictionary = await responseFrench.json();

        const fetchedDictionaries = {
          'German': germanDictionary,
          'French': frenchDictionary
        };

        const languagesWithLevels = ['Spanish', 'Dutch'];
        for (const language of languagesWithLevels) {
          for (let level = 1; level <= 3; level++) {
            const response = await fetch(`https://raw.githubusercontent.com/WenyeSong/CS370/main/dict/${language.toLowerCase()}_part_${level}.json`);
            if (!response.ok) throw new Error(`Failed to fetch ${language} level ${level}`);
            const dictionary = await response.json();
            fetchedDictionaries[`${language} Level ${level}`] = dictionary;
          }
        }
  
        setDictionaries(fetchedDictionaries);
      } catch (error) {
        console.error('Error fetching dictionaries:', error);
      }
    };
    fetchDictionaries();
  }, []);

  
  const hasDifficultyLevels = (language) => {
    return ['Spanish', 'Dutch'].includes(language);
  };
  
  const addWord = async (question, answer, languageId) => {
    console.log("Attempting to add word with language ID:", languageId); // Logs current language ID
    if (!languageId) {
      console.error("Invalid language ID:", languageId);
      alert('Invalid language selected. Please select a valid language.');
      return;
    }
  
    if (!question || typeof question !== 'string' || question.trim() === '') {
      console.error("Invalid question:", question);
      return; // Stop the function if validation fails
    }
  
    if (!answer || typeof answer !== 'string' || answer.trim() === '') {
      console.error("Invalid answer:", answer);
      return; // Stop the function if validation fails
    }

    
  
    try {
      const payload = {
        foreign_word: question,
        english_translation: answer,
        language_id: languageId,
      };
  
      const response = await fetch(`http://${serverIP}/api/user/${token}/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
  
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setSuccessMessage('Word added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error("Failed to add word:", error.message);
    }
  };
  
  
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = amountEl.current.value;
  
    // Construct the key based on language and difficulty level
    const dictionaryKey = selectedDictionary + (difficultyLevel && hasDifficultyLevels(selectedDictionary) ? ` Level ${difficultyLevel}` : '');
  
    if (!selectedDictionary || !dictionaries[dictionaryKey]) {
      alert('Please select a valid dictionary');
      return;
    }
  
    const dictionary = dictionaries[dictionaryKey];
    const generatedFlashcards = [];
    function formatAnswer(answerArray) {
      return answerArray.join(', ');
    }
  
    for (let i = 0; i < amount; i++) {
      const randomIndex = Math.floor(Math.random() * Object.keys(dictionary).length);
      const randomKey = Object.keys(dictionary)[randomIndex];
      const question = randomKey;
      const answer = formatAnswer(dictionary[randomKey]);
  
      generatedFlashcards.push({ id: i, question, answer });
    }
  
    setFlashcards(generatedFlashcards);
  };
  


return (
    <><Navbar/> 
      <div className="flashcard-form-container">
        <h2>Flashcard</h2>
        {successMessage && <p className="success-message">{successMessage}</p>}
        <form className="header" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="amount">Number of Questions</label>
            <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
          </div>
          <div className="form-group">
            <label htmlFor="dictionary">Select a Language</label>
            <select id="dictionary" onChange={(e) => {
                setSelectedDictionary(e.target.value);
                setDifficultyLevel(hasDifficultyLevels(e.target.value) ? 1 : null);
              }} value={selectedDictionary}>
              <option value="">Select Language</option>
              {['German', 'French', 'Spanish', 'Dutch'].map((language) => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          {selectedDictionary && hasDifficultyLevels(selectedDictionary) && (
            <div className="form-group">
              <label htmlFor="difficulty">Select Difficulty Level</label>
              <select id="difficulty" onChange={(e) => setDifficultyLevel(e.target.value)} value={difficultyLevel}>
                <option value="1">Level 1</option>
                <option value="2">Level 2</option>
                <option value="3">Level 3</option>
              </select>
            </div>
          )}
          <div className="btn-container">
            <button className="btn">Generate</button>
          </div>
        </form>
      </div>
      <div className="container">
      <FlashcardList 
        flashcards={flashcards} 
        addWord={addWord} 
        languageId={languageId}
      />
      </div>
      {/* <div className="link-btn-container">
        <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
      </div> */}
    </>
);
}

function Flashcard({ flashcard, addWord, languageId }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState('initial');
  const frontEl = useRef();
  const backEl = useRef();

  // Set the maximum height based on the content size
  useEffect(() => {
    const setMaxHeight = () => {
      const frontHeight = frontEl.current.getBoundingClientRect().height;
      const backHeight = backEl.current.getBoundingClientRect().height;
      setHeight(Math.max(frontHeight, backHeight, 100));
    };
    setMaxHeight();
    window.addEventListener('resize', setMaxHeight);
    return () => window.removeEventListener('resize', setMaxHeight);
  }, []);

  return (
    <div className="flashcard-container" onClick={() => setFlip(!flip)}>
      <div className={`card ${flip ? 'flip' : ''}`} style={{ height }}>
        <div className="front" ref={frontEl}>
          {flashcard.question}
        </div>
        <div className="back" ref={backEl}>
          {flashcard.answer}
        </div>
      </div>
      <button className="add-word-btn" onClick={() => {
        console.log(`Adding word with Language ID: ${languageId}`); // Debugging statement
        if (languageId) {
          addWord(flashcard.question, flashcard.answer, languageId);
        } else {
          alert('Language not selected or not loaded yet.');
        }
      }}>
        Add Word
      </button>
    </div>
  );
}

function FlashcardList({ flashcards, addWord, languageId }) {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);

  const goToPreviousFlashcard = () => {
      setCurrentFlashcardIndex(prevIndex => Math.max(prevIndex - 1, 0));
  };

  const goToNextFlashcard = () => {
      setCurrentFlashcardIndex(prevIndex => Math.min(prevIndex + 1, flashcards.length - 1));
  };

  return (
      <div className="flashcard-list">
          {flashcards.length > 0 && (
              <div className="flashcard">
                  <div className='flashcard-container'>
                      <Flashcard 
                          flashcard={flashcards[currentFlashcardIndex]} 
                          addWord={addWord} 
                          languageId={languageId} 
                      />
                  </div>
                  <div className="navigation-buttons">
                      <button onClick={goToPreviousFlashcard} disabled={currentFlashcardIndex === 0}>←</button>
                      <span className="flashcard-number">{currentFlashcardIndex + 1} / {flashcards.length}</span>
                      <button onClick={goToNextFlashcard} disabled={currentFlashcardIndex === flashcards.length - 1}>→</button>
                  </div>
              </div>
          )}
      </div>
  );
}



// function Flashcard({ flashcard, addWord }) {
//   const [flip, setFlip] = useState(false);
//   const [height, setHeight] = useState('initial');

//   const frontEl = useRef();
//   const backEl = useRef();

//   function setMaxHeight() {
//     const frontHeight = frontEl.current.getBoundingClientRect().height;
//     const backHeight = backEl.current.getBoundingClientRect().height;
//     setHeight(Math.max(frontHeight, backHeight, 100));
//   }

//   useEffect(setMaxHeight, [flashcard.question, flashcard.answer]);
//   useEffect(() => {
//     window.addEventListener('resize', setMaxHeight);
//     return () => window.removeEventListener('resize', setMaxHeight);
//   }, []);

  
//   return (
//     <div className="flashcard-container"> {/* Added container */}
//     <div
//       className={`card ${flip ? 'flip' : ''}`}
//       style={{ height: height }}
//       onClick={() => setFlip(!flip)}
//     >
//       <div className="front" ref={frontEl}>
//         {flashcard.question}
//       </div>
//       <div className="back" ref={backEl}>{flashcard.answer}</div> 
//     </div>
//     <div> {/* Added container for the button */}
//       <button className="add-word-btn" onClick={() => addWord(flashcard.question, flashcard.answer)}>Add Word</button>
//     </div>
//     </div>
//   );
// }