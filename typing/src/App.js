import './App.css'
import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'



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
          <Route path='*' element={<h1>Not Found</h1>} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
export default App
