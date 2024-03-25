import React, {useState} from 'react'
import {Link} from 'react-router-dom';
import './Navbar.css';
function Navbar(){
    const [click, setClick] = useState(false);
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    return(
      <>
        <nav className="navbar">
            <div className="navbar-container"> 
                <Link to='/' className='nacbar-logo'>
                  Menu <i className='fab fa-typo3'/>
                </Link>
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'}/>
                </div>
                <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                    <li className='nav-time'>
                        <Link to='/Account' className='nav-links subtitle' onClick={closeMobileMenu}>
                        Account
                        </Link>
                    </li>
                    <li className='nav-time'>
                        <Link to='/Vocabulary Test' className='nav-links subtitle' onClick={closeMobileMenu}>
                        Typing go!
                        </Link>
                    </li>
                    <li className='nav-time'>
                        <Link to='/Vocabulary Test' className='nav-links subtitle' onClick={closeMobileMenu}>
                        Vocabulary Test
                        </Link>
                    </li>
                    <li className='nav-time'>
                        <Link to='/Saved Words List' className='nav-links subtitle' onClick={closeMobileMenu}>
                        Saved Words List
                        </Link>
                    </li>
                    <li className='nav-time'>
                        <Link to='/Flashcard' className='nav-links subtitle' onClick={closeMobileMenu}>
                        Flashcard
                        </Link>
                    </li>
                </ul>
            </div>       
        </nav>
      </>
    );
}

export default Navbar