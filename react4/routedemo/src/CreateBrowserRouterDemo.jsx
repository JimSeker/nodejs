import React from 'react'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Products from './pages/Products'
import Contact from './pages/Contact'
import About from './pages/About'
import RootLayout from './layout/RootLayout'
import NotFound from './pages/NotFound';


const CreateBrowserRouterDemo = () => {
    const router = createBrowserRouter(
        createRoutesFromElements(
            <>
                <Route path='/' element={< RootLayout />} >
                    <Route index element={< Home />} />
                    <Route path='products' element={< Products />} />
                    <Route path='contact' element={< Contact />} />
                    <Route path='about' element={< About />} />
                    <Route path='*' element={< NotFound />} />
                </Route>
            </>
        )
    )

    return (
        <RouterProvider router={router} />  
  )
}

export default CreateBrowserRouterDemo