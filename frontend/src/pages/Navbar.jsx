import React, { useState } from "react";
import logoImage from '../VocabGrowLogo.png';
import "./Navbar.css";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
    const [username, setUsername] = useState('');
    const hellouser = () => {
      if (localStorage.getItem('token') == null) {
        return (
          <></>
        );
      } else {
        return (
            <li id="greeting">hello {localStorage.getItem('token').split('-')[0]}!</li>
        );
      }
    }
    const logout = () => {
      localStorage.removeItem('token');
      setClick(false);
    }
    return (
    　<header className = "navhead">
    　　<div className="container">  
        <img src={logoImage} alt="logo" className="logo" />
        <nav>
        {/* <ul className={click ? 'nav-menu active' : 'nav-menu'}>*/} 
        <ul>
          <li className='nav-links'>
            {hellouser()}
          </li>
         <li>
            <Link to='/' className='nav-links subtitle' onClick={logout}>
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