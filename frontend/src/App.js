import './App.css'
import { useState } from 'react'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Error from './pages/Error'
import Main from './pages/Main'
import Voctest from './pages/Voctest'
import SavedList from './pages/SavedList'
import TypeGo from './pages/TypeGo'
import Register from './pages/Register';
import FlashcardPage from './pages/FlashcardPage';
import FillInBlank from './pages/Voctest/FillInBlank';
import MultipleChoice from './pages/Voctest/MultipleChoice'


import { Navbar } from "./pages/Navbar";

function App () {

  const [currentForm, setCurrentForm] = useState('login');

  // const appStyle = {
  //   backgroundImage: 'url(../src/image-from-rawpixel-id-577697-jpeg.jpg)',
  // }

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  const switchForm = (formName) => {
    setCurrentForm(formName);
  };
  

  return (
    <BrowserRouter>
      <div className='App' >
      {/* <div style={appStyle}></div> */}
        
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/Register' element={<Register onFormSwitch={switchForm} />} />
          <Route path='/TypeGo' element={<TypeGo />} />
          <Route path='/Voctest' element={<Voctest />} />
          <Route path='/SavedList' element={<SavedList />} />
          <Route path='/error' element={<Error />} />
          <Route path='*' element={<Error />} />
          <Route path="/flashcards" element={<FlashcardPage />} />
          <Route path="/fill-in-blank" element={<FillInBlank />} />
          <Route path="/multiple-choice" element={<MultipleChoice />} />
        </Routes>
      </div>
    </BrowserRouter >
  )
}
export default App
