import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Error from './pages/Error'



function App () {
  return (
    <BrowserRouter>
      <div className='App' >
        <Routes>
          <Route path='/'
            element={<h1>Home</h1>
            } >
          </Route>
          <Route path='/login' element={<Login />}></Route>
          <Route path='*' element={<Error />} />
        </Routes>
      </div>
    </BrowserRouter >
  )
}
export default App
