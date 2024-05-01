
import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { Button, Form } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Navbar } from "../Navbar";
import {message} from 'antd'


export default function FlashcardPage() {
  const config = require('../../config.json');
  const serverIP = config.serverIP;
  const navigate = useNavigate();


  const [flashcards, setFlashcards] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState('');
  const [dictionaries, setDictionaries] = useState({});
  const [languageId, setLanguageId] = useState();
  const amountEl = useRef();
  const [successMessage, setSuccessMessage] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [notification, setNotification] = useState('');
  const token = localStorage.getItem('token');


  const dictionaryToLanguageId = {
    'Chinese': 6,
    'German': 5,
    'French': 1,
    'Spanish': 3,
    'Dutch': 4
  };
  
  useEffect(() => {
    if (selectedDictionary === "Saved List") {
      fetchSavedFlashcards();
    } else {
      fetchDictionaries();
    }
  }, [selectedDictionary]);


  useEffect(() => {
    if (selectedDictionary) {
      const newLanguageId = dictionaryToLanguageId[selectedDictionary];
      setLanguageId(newLanguageId);
      console.log('Selected Dictionary:', selectedDictionary, 'Language ID:', newLanguageId);
    }
  }, [selectedDictionary]);


  const fetchDictionaries = async () => {
    try {
      const responseGerman = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dictionry_crawl/combine/german-english.json');
      const germanDictionary = await responseGerman.json();
      const responseFrench = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dictionary_crawl/combine/french-english.json');
      const frenchDictionary = await responseFrench.json();


      const fetchedDictionaries = {
        'German': germanDictionary,
        'French': frenchDictionary
      };


      const languagesWithLevels = ['Spanish', 'Dutch'];
      for (const language of languagesWithLevels) {
        for (let level = 1; level <= 3; level++) {
          const response = await fetch(`https://raw.githubusercontent.com/WenyeSong/CS370/main/dictionary_crawl/combine/${language.toLowerCase()}_part_${level}.json`);
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


  const fetchSavedFlashcards = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://${serverIP}/api/user/${token}/words`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();


      console.log("Data structure:", data);




      const fetchedFlashcards = Object.entries(data).map(([term, details]) => {
        return {
          id: term,
          question: details.foreign_word,
          answer: details.english_translations.join(', ')
        };
      });
      
      
      setFlashcards(fetchedFlashcards);
    } catch (error) {
      console.error("Fetch error: ", error.message);
    }
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    const amount = amountEl.current.value;


    const dictionaryKey = selectedDictionary + (difficultyLevel && hasDifficultyLevels(selectedDictionary) ? ` Level ${difficultyLevel}` : '');
    if (selectedDictionary === "Saved List") {
      message.success('Words already generated automatically!');
      return; 
    }

    if (!selectedDictionary || !dictionaries[dictionaryKey]) {
      message.warning('Please select a valid dictionary');
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


  const hasDifficultyLevels = (language) => {
    return ['Spanish', 'Dutch'].includes(language);
  };


  const addWord = async (question, answer, languageId, selectedDictionary) => {
    console.log("Attempting to add word with language ID:", languageId); // Logs current language ID
    if (!languageId) {
      console.error("Invalid language ID:", languageId);
      message.warning('Invalid language selected. Please select a valid language.');
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
  
      if (response.ok) {
        message.success('Word added successfully!');
      } else if (response.status === 409) {
        message.warning('This word is already in your list!');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      } catch (error) {
      console.error("Failed to add word:", error.message);
    }
  };


  return (
    <>
      <Navbar />
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
            <select
              id="dictionary"
              onChange={(e) => {
                setSelectedDictionary(e.target.value);
                setDifficultyLevel(hasDifficultyLevels(e.target.value) ? 1 : null);
              }}
              value={selectedDictionary}
            >
              <option value="">Select Language</option>
              {['German', 'French', 'Spanish', 'Dutch', 'Saved List'].map((language) => (
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
          setNotification={setNotification}
          notification={notification}
          selectedDictionary={selectedDictionary}
        />
      </div>
    </>
  );
}


function Flashcard({ flashcard, addWord, languageId, selectedDictionary}) {
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
      
      {selectedDictionary !== "Saved List" && (
      <button className="add-word-btn" onClick={() => {
        console.log('Selected Dictionary:', selectedDictionary);

        console.log(`Adding word with Language ID: ${flashcard.question}`); // Debugging statement
        console.log(`Adding word with Language ID: ${flashcard.answer}`); // Debugging statement
        console.log(`Adding word with Language ID: ${languageId}`); // Debugging statement
        if (languageId) {
          addWord(flashcard.question, flashcard.answer, languageId);
        } else {
          message.warning('Language not selected or not loaded yet.');
        }
      }}>
        Add Word
      </button>
      )}
    </div>
  );
}
function FlashcardList({ flashcards, addWord, languageId, setNotification, notification, selectedDictionary }) {
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);


  const displayNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification('');
    }, 2000); // Clear the notification after 2 seconds
  };


  const goToPreviousFlashcard = () => {
    setCurrentFlashcardIndex(prevIndex => {
      if (prevIndex === 0) {
        message.info('Start of the list !!!');
        return prevIndex; // Stay on the first flashcard
      } else {
        return prevIndex - 1; // Move to the previous card
      }
    });
  };
  
  const goToNextFlashcard = () => {
    setCurrentFlashcardIndex(prevIndex => {
      if (prevIndex === flashcards.length - 1) {
        message.info('End of the list !!!');
        return prevIndex; // Stay on the last flashcard
      } else {
        return prevIndex + 1; // Proceed to the next card
      }
    });
  };
  
  return (
    <div className="flashcard-list">
      {notification && <div className="notification">{notification}</div>}
      {flashcards.length > 0 && (
        <div className="flashcard">
          <div className='flashcard-container'>
            <Flashcard 
              flashcard={flashcards[currentFlashcardIndex]} 
              addWord={addWord} 
              languageId={languageId} 
              selectedDictionary={selectedDictionary}
            />
          </div>
          <div className="navigation-buttons">
            <button onClick={goToPreviousFlashcard}>←</button>
            <span className="flashcard-number">{currentFlashcardIndex + 1} / {flashcards.length}</span>
            <button onClick={goToNextFlashcard}>→</button>
          </div>
        </div>
      )}
    </div>
  );
}