import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Error from './pages/Error'
import Main from './pages/Main'


function App () {
  return (
    <BrowserRouter>
      <div className='App' >
        <Routes>
          <Route path='/' element={<Main />}></Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='*' element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter >
  )
}
export default App
