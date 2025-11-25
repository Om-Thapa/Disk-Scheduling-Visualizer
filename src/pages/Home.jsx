import React from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function Home(){
  const navigate = useNavigate()
  return (
    <header className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-black" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-32">
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold">Scheduling Visualizer</h1>
          <p className="mt-3 text-xl text-gray-200">CPU & real-time scheduling algorithms — interactive visual learner toolkit</p>

          <div className="mt-8 flex gap-4">
            <button onClick={() => navigate('/run')} className="px-6 py-3 rounded-md bg-pink-600 text-white shadow-md">RUN ALGO</button>
            <button onClick={() => navigate('/about')} className="px-6 py-3 rounded-md bg-white/90 text-gray-900">About</button>
          </div>
        </motion.div>
      </div>
    </header>
  )
}
