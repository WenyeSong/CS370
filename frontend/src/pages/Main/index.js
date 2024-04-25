import React from 'react';
import { Link } from 'react-router-dom';
import './index.css';

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
  </div>
  
  );
}

export default Main;
