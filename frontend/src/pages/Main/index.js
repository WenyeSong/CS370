import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

import flashcardImage from '../flashcard.png'; // Adjust the path if necessary
import vocabTestImage from '../vocab-test.png'; // Adjust the path if necessary
import wordlistImage from '../wordlist.png'; // Adjust the path if necessary

function Main() {
  return (
    <div className="main-page">
      <header className = "main-header">
        {/* <div className="navbar-container"> */}
          <nav className = "main-page-navbar">
            <ul>
              <li>
                <Link to='/Login' className='main-link subtitle'>
                  Login
                </Link>
              </li>
              <li>
                <Link to='/Register' className='main-link subtitle'>
                  Register
                </Link>
              </li>
            </ul>
          </nav> 
        {/* </div> */}
      </header>
  
    <div className="main-content">
      <h1 className="main-heading">VocabGrow</h1>
      <h2 className="main-subtitle">Start Your Unique Language Learning Experience Now</h2>
      <div className="main-links">
        <h5>
        Haven't logged in or don't have an account? Please first
        <Link to='/Login' className='main-link subtitle'>
          Login
        </Link>or
        <Link to='/Register' className='main-link subtitle'>
          Register
        </Link>
        </h5>
      </div>
    </div>

    <div className="introduction">
      <h2>You can use VocabGrow to ...</h2>
      <div className="features-container">
        <div className="feature-item">
          <f className = "topic">Build your own </f><f className="topic-description">WORDLIST:</f>
            <ul className="my-bullet-list">
              <li>
                <p>Add your own <f className="feature-description">unknown words</f> in other languages and define them in English. </p>
              </li>
              <li>          
                <p>Review the words you added in our <f className="feature-description">FLASHCARD</f> function. </p>
              </li>
            </ul>
        </div>
        <div className="feature-item">
          <f className = "topic">Learn new vocabulary with </f><f className="topic-description">FLASHCARD:</f>
            <ul className="my-bullet-list">
              <li>
                <p>Select any language from <f className="feature-description">German, French, Spanish, Dutch, and Chinese</f> and generete flashcards of an amount that you decide!</p>
              </li>
              <li>          
                <p>Forget its definition? Click the flashcard, <f className="feature-description">turn to its back</f>, and check its English defitions!</p>
              </li>
            </ul>
        </div>
        <div className="feature-item">
          
          <f className = "topic">Test what you've learned in </f><f className="topic-description">Vocab Test:</f>
              <ul className="my-bullet-list">
                <li>
                  <p><f className="feature-description">Fill in the blank</f> or <f className="feature-description">multiple choice</f>: you decide the format of your vocab quiz!</p>
                </li>
                <li>          
                  <p>Check your <f className="feature-description">correction rate</f> instantly after quiz ends! </p>
                </li>
              </ul>
        </div>
      </div>
    </div>
  </div>
  
  );
}

export default Main;
