
import './App.css';
import React from 'react';
import Navbar from './components/Navbar';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <>
    <Router>
    <h1>VocabGrow</h1>
    <h2>Welcome! Study fun!</h2>
      <Navbar />
      <Routes>
        <Route path='/' exact  />
      </Routes>
      </Router>
    
      
    </>
  );
}

export default App;
