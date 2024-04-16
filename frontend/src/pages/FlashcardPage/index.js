import React, { useState, useEffect, useRef } from 'react';
import './index.css';
import { useNavigate } from 'react-router-dom';

export default function FlashcardPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [selectedDictionary, setSelectedDictionary] = useState('');
  const [dictionaries, setDictionaries] = useState({});
  const amountEl = useRef();
  const navigate = useNavigate();

  // Define goBackToMainPage function
  const goBackToMainPage = () => {
    navigate('/'); // Navigate to the main page
  };

  useEffect(() => {
    // Fetch dictionaries from the provided URLs
    const fetchDictionaries = async () => {
      try {
        const responseChinese = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dict/chinese-english.json');
        const responseFrench = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dict/french-english.json');
        const responseGerman = await fetch('https://raw.githubusercontent.com/WenyeSong/CS370/main/dict/german-english.json');

        if (!responseChinese.ok || !responseFrench.ok || !responseGerman.ok) {
          throw new Error('Failed to fetch dictionaries');
        }

        const chineseDictionary = await responseChinese.json();
        const frenchDictionary = await responseFrench.json();
        const germanDictionary = await responseGerman.json();

        setDictionaries({
          'Chinese': chineseDictionary,
          'French': frenchDictionary,
          'German': germanDictionary,
        });
      } catch (error) {
        console.error('Error fetching dictionaries:', error);
      }
    };

    fetchDictionaries();
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    const amount = amountEl.current.value;

    if (!selectedDictionary || !dictionaries[selectedDictionary]) {
      alert('Please select a dictionary');
      return;
    }

    // Generate flashcards using the selected dictionary
    const dictionary = dictionaries[selectedDictionary];
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
  }

  return (
    <>
      <form className="header" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="amount">Number of Questions</label>
          <input type="number" id="amount" min="1" step="1" defaultValue={10} ref={amountEl} />
        </div>
        <div className="form-group">
          <label htmlFor="dictionary">Select a Dictionary</label>
          <select id="dictionary" onChange={(e) => setSelectedDictionary(e.target.value)} value={selectedDictionary}>
            <option value="">Select Dictionary</option>
            {Object.keys(dictionaries).map((dictionaryName) => (
              <option key={dictionaryName} value={dictionaryName}>{dictionaryName}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <button className="btn">Generate</button>
        </div>
      </form>
      <div className="container">
        <FlashcardList flashcards={flashcards} />
      </div>
      <button className="link-btn" onClick={goBackToMainPage}>Back to Main Page</button>
    </>
  );
}

function FlashcardList({ flashcards }) {
  return (
    <div className="card-grid">
      {flashcards.map(flashcard => {
        return <Flashcard flashcard={flashcard} key={flashcard.id} />;
      })}
    </div>
  );
}

function Flashcard({ flashcard }) {
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
  );
}
