import React, {useState, useEffect, useRef } from 'react';
import './index.css';
import { Link, useNavigate } from 'react-router-dom';
import dictionary from './french-english.json';


export default function App() {
  const [flashcards, setFlashcards] = useState([]);

  const categoryEl = useRef();
  const amountEl = useRef();
  const navigate = useNavigate();

 // Define goBackToMainPage function
  const goBackToMainPage = () => {
      navigate('/'); // Navigate to the main page
    };

  function handleSubmit(e) {
    e.preventDefault();
    const amount = amountEl.current.value;

    // Generate flashcards using the dictionary
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

  useEffect(setMaxHeight, [flashcard.question, flashcard.answer, flashcard.options]);
  useEffect(() => {
    window.addEventListener('resize', setMaxHeight);
    return () => window.removeEventListener('resize', setMaxHeight);
  }, []);

  return (
    <>
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
    </>

  );
}
