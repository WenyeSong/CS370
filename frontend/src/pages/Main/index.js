import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

function Main() {
  return (
  
    <div className="main-content">
      <h1 className="main-heading">VocabGrow</h1>
      <h2 className="main-subtitle">Welcome! Study fun!</h2>
      <div className="main-links">
        <Link to='/Login' className='main-link subtitle'>
          Login
        </Link>
        <Link to='/Voctest' className='main-link subtitle'>
          Vocabulary Test
        </Link>
        <Link to='/SavedList' className='main-link subtitle'>
          Saved Words List
        </Link>
        <Link to='/Register' className='main-link subtitle'>
          Register
        </Link>
        <Link to='/flashcards' className='main-link subtitle'>
          Flashcard
        </Link>
      </div>
    </div>
  
  );
}

export default Main;
