import React, { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  const [dark, setDark] = useState(true)
  return (
    <nav className="fixed bg-amber-50/5 w-full z-30 top-0 left-0 backdrop-blur-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">📀</div>
          <span className="font-semibold tracking-wide">Scheduler</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <Link to="/" className="hover:underline">Home</Link>
          <Link to="/run" className="hover:underline">Algorithms</Link>
          <Link to="/about" className="hover:underline">About</Link>
          <button
            aria-label="toggle dark"
            onClick={() => { setDark(!dark); document.documentElement.classList.toggle('dark') }}
            className="p-2 rounded-md bg-white/5"
          >{dark ? '🌙' : '☀️'}</button>
        </div>
        <div className="md:hidden">
          <Link to="/run" className="px-3 py-2 rounded-md bg-amber-600 text-white">Run</Link>
        </div>
      </div>
    </nav>
  )
}
