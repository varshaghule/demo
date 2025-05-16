<<<<<<< HEAD
<<<<<<< HEAD
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from "react-router-dom"
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
=======
=======
>>>>>>> a1ac116 (All last)
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom'
import StoreContextProvider from './context/StoreContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StoreContextProvider>
       <App/>
    </StoreContextProvider>
<<<<<<< HEAD
>>>>>>> a09ea5f (Frontend added)
=======
>>>>>>> a1ac116 (All last)
  </BrowserRouter>
)
