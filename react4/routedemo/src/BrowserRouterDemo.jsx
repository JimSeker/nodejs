import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './Navbar'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import About from './pages/About'
import NotFound from './pages/NotFound'

const BrowserRouterDemo = () => {
  return (
      <BrowserRouter>
      <Navbar/>
      <Routes>
        <Route path='/' element={< Home />} />
        <Route path='/products' element={< Products />} />
        <Route path='/contact' element={< Contact />} />
        <Route path='/about' element={< About />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default BrowserRouterDemo