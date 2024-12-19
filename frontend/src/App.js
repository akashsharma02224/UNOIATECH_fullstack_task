import React from 'react'
import { Mainpage } from './components/LandingPage'
import Details from './components/Details'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export default function App() {
  return (
<BrowserRouter>
<Routes>
  <Route path="/" element={<Mainpage />} />
  <Route path="/Details/:id" element={<Details />} />
</Routes>
</BrowserRouter>

  )
}
