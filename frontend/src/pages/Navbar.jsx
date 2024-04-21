import React, { useState } from "react";
import logoImage from '../VocabGrowLogo.png';
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [username, setUsername] = useState('');
  
    return (
    　<header>
    　　<div className="container">  
        <img src={logoImage} alt="logo" className="logo" />
        <nav>
        {/* <ul className={click ? 'nav-menu active' : 'nav-menu'}>*/} 
        <ul>
        <li className='nav-links'>
            Hello, User!  {username} {/* username, need to connect to backend */}
          </li>
         <li>
            <Link to='/Login' className='nav-links subtitle' onClick={closeMobileMenu}>
              Log out
            </Link>
          </li>
          <li>
            <Link to='/Register' className='nav-links subtitle' onClick={closeMobileMenu}>
              Register
            </Link>
          </li>
          {/* <li>
            <Link to='/TypeGo' className='nav-links subtitle' onClick={closeMobileMenu}>
              Typing go!
            </Link>
          </li> */}
          <li>
            <Link to='/Voctest' className='nav-links subtitle' onClick={closeMobileMenu}>
              Vocabulary Test
            </Link>
          </li>
          <li>
            <Link to='/SavedList' className='nav-links subtitle' onClick={closeMobileMenu}>
              Saved Words List
            </Link>
          </li>

          <li>
            <Link to='/flashcards' className='nav-links subtitle' onClick={closeMobileMenu}>
              Flashcard
            </Link>
            
          </li>
        </ul>
      </nav>
    　</div>
    </header>
    );
  };