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
import Flashcard  from './pages/Flashcard'

function App () {

  const [currentForm, setCurrentForm] = useState('login');

  const toggleForm = (formName) => {
    setCurrentForm(formName);
  }

  const switchForm = (formName) => {
    setCurrentForm(formName);
  };
  

  return (
    <BrowserRouter>
      <div className='App' >
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/Register' element={<Register onFormSwitch={switchForm} />} />
          <Route path='/TypeGo' element={<TypeGo />} />
          <Route path='/Voctest' element={<Voctest />} />
          <Route path='/SavedList' element={<SavedList />} />
          <Route path='/error' element={<Error />} />
          <Route path='*' element={<Error />} />
          <Route path = '/Flashcard' element = {<Flashcard />} />
        </Routes>
      </div>
    </BrowserRouter >
  )
}
export default App
