import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import RunAlgo from './pages/RunAlgo'
import About from './pages/About'

export default function App(){
  
  return (
    <>
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/run" element={<RunAlgo/>} />
          <Route path="/about" element={<About/>} />
        </Routes>
      </Layout>
    </Router>
    </>
  )
}

