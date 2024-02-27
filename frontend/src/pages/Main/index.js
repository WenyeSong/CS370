import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './index.css'
import Voctest from '../Voctest'

function Main () {
    const [click, setClick] = useState(false)
    const handleClick = () => setClick(!click)
    const closeMobileMenu = () => setClick(false)
    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <h1>VocabGrow</h1>
                    <h2>Welcome! Study fun!</h2>
                    <Link to='/' className='nacbar-logo'>
                    </Link>
                    <div className='menu-icon' onClick={handleClick}>
                        <i className={click ? 'fas fa-times' : 'fas fa-bars'} />
                    </div>
                    <ul className={click ? 'nav-menu active' : 'nav-menu'}>
                        <li className='nav-time'>
                            <Link to='/Login' className='nav-links subtitle' onClick={closeMobileMenu}>
                                Login
                            </Link>
                        </li>
                        <li className='nav-time'>
                            <Link to='/TypeGo' className='nav-links subtitle' onClick={closeMobileMenu}>
                                Typing go!
                            </Link>
                        </li>
                        <li className='nav-time'>
                            <Link to='/Voctest' className='nav-links subtitle' onClick={closeMobileMenu}>
                                Vocabulary Test
                            </Link>
                        </li>
                        <li className='nav-time'>
                            <Link to='/SavedList' className='nav-links subtitle' onClick={closeMobileMenu}>
                                Saved Words List
                            </Link>
                        </li>
                        <li className='nav-time'>
                            <Link to='/Register' className='nav-links subtitle' onClick={closeMobileMenu}>
                                Register
                            </Link>
                        </li>
                    </ul>
                </div>
            </nav>
        </>
    )
}

export default Main