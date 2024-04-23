import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { Button, Form } from 'antd'; // Import Button from antd for styling
import { useNavigate } from 'react-router-dom';

export default function FlashcardPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState('');
  const [dictionaries, setDictionaries] = useState({});
  const amountEl = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [successMessage, setSuccessMessage] = useState('');
  const [difficultyLevel, setDifficultyLevel] = useState(1);  // Default level is set to 1 !!!!!!!!!!!!!!!!!!!!




  // Define goBackToMainPage function
  const goBackToMainPage = () => {
    navigate('/'); // Navigate to the main page
  };

  useEffect(() => {
    const fetchDictionaries = async () => {
      try {
        // Fetch dictionaries that do not have difficulty levels
        const responseChinese = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dict/chinese-english.json');
        const responseGerman = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dict/german-english.json');
        const chineseDictionary = await responseChinese.json();
        const germanDictionary = await responseGerman.json();
  
        // Initialize dictionaries object with languages that do not have levels
        const fetchedDictionaries = {
          'Chinese': chineseDictionary,
          'German': germanDictionary
        };
  
        // Languages with difficulty levels
        const languagesWithLevels = ['French', 'Spanish', 'Dutch'];
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
    return ['French', 'Spanish', 'Dutch'].includes(language);
  };
  

  const addWord = async (question, answer) => {
    try {
      const payload = {
        foreign_word: question,
        english_translation: answer,
      };
      const response = await fetch(`http://localhost:5000/user/${token}/words`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      setSuccessMessage('Word added successfully!'); // Set success message
      setTimeout(() => setSuccessMessage(''), 1000); // Clear success message after 3 seconds
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
    <>
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
              {['Chinese', 'German', 'French', 'Spanish', 'Dutch'].map((language) => (
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
        <FlashcardList flashcards={flashcards} addWord={addWord} />
      </div>
      <div className="link-btn-container">
        <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
      </div>
    </>
);
}

function FlashcardList({ flashcards, addWord }) {
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
            <Flashcard flashcard={flashcards[currentFlashcardIndex]} addWord={addWord} />
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

function Flashcard({ flashcard, addWord }) {
  const [flip, setFlip] = useState(false);
  const [height, setHeight] = useState('initial');

  const frontEl = useRef();
  const backEl = useRef();

  function setMaxHeight() {
    const frontHeight = frontEl.current.getBoundingClientRect().height;
    const backHeight = backEl.current.getBoundingClientRect().height;
    setHeight(Math.max(frontHeight, backHeight, 100));
  }

  useEffect(setMaxHeight, [flashcard.question, flashcard.answer]);
  useEffect(() => {
    window.addEventListener('resize', setMaxHeight);
    return () => window.removeEventListener('resize', setMaxHeight);
  }, []);

  return (
    <div className="flashcard-container"> {/* Added container */}
    <div
      className={`card ${flip ? 'flip' : ''}`}
      style={{ height: height }}
      onClick={() => setFlip(!flip)}
    >
      <div className="front" ref={frontEl}>
        {flashcard.question}
      </div>
      <div className="back" ref={backEl}>{flashcard.answer}</div> 
    </div>
    <div> {/* Added container for the button */}
      <button className="add-word-btn" onClick={() => addWord(flashcard.question, flashcard.answer)}>Add Word</button>
    </div>
    </div>
  );
}