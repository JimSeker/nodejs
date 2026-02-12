import React from 'react'
import { Route, Outlet } from 'react-router-dom'
import Navbar from '../Navbar'

const RootLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  )
}

export default RootLayout