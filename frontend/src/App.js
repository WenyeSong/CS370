import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Error from './pages/Error'
import Main from './pages/Main'
import Voctest from './pages/Voctest'
import SavedList from './pages/SavedList'
import TypeGo from './pages/TypeGo'

function App () {
  return (
    <BrowserRouter>
      <div className='App' >
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='/TypeGo' element={<TypeGo />} />
          <Route path='/Voctest' element={<Voctest />} />
          <Route path='/SavedList' element={<SavedList />} />

          <Route path='/error' element={<Error />} />
          <Route path='*' element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter >
  )
}
export default App
