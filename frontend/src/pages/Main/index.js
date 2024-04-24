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
        <Link to='/Register' className='main-link subtitle'>
          Register
        </Link>
      </div>
    </div>
  
  );
}

export default Main;
