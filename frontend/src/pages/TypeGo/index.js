import React, { useState, useEffect } from 'react'
import './index.css'
import randomWords, { generate } from 'random-words'
import dictionary from './french-english.json';

const NUM_OF_WORDS = 20


function TypeGo () {
  // words = what the app generates for quizzing the user
  const [words, setWords] = useState([])
  const [currInput, setCurrInput] = useState("")
  const [currWordIndex, setCurrWordIndex] = useState(0)

  const wrongWordList= []

  useEffect(() => {
    setWords(generateQuizList())
  },[])

  // the following function is derived from the tutorial: 
  function generateQuizList() {
    return new Array(NUM_OF_WORDS).fill(null).map(() => generate())
  }

  function handleKeyDown(event) {
    console.log(event.key)
  }



  return (
    <div className = "TypeGo"> 
      <div className="section">
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>TypeGo Quiz: Try Your Best!</h2>
        </div>
      </div>
      <div className="control is-expanded section">
        <input type="text" className="input" onKeyDown={handleKeyDown} value={currInput} 
        onChange={(e) => setCurrInput(e.target.value)} />
      </div>
      <div className="section">
        <button className="button is-info is-fullwidth">
          Start
        </button>
      </div>
      <div className = "section">
         <div className="card">
          <div className="card-content">
            <div className="content">
              {words.map((word, i) => (
                <span key={i}>
                  <span>
                    {word.split("").map((char, idx) => (
                      <span key = {idx}>{char}</span>
                    ))}
                  </span>
                  <span> </span>
                </span>
              ))}
            </div>
          </div>
         </div>
      </div>
    </div>
  );

  // function generateQuizList() {
  //   const quizList = []

  //   function formatAnswer(answerArray) {
  //     return answerArray.join(', ');
  //   }

  //   for (let i = 0; i < NUM_OF_WORDS; i++) {
  //     const randomIndex = Math.floor(Math.random() * Object.keys(dictionary).length);
  //     const randomKey = Object.keys(dictionary)[randomIndex];
  //     const question = randomKey;
  //     const answer = formatAnswer(dictionary[randomKey]);

  //     quizList.push({ id: i, question, answer });
  //   }

  // }
}

export default TypeGo;