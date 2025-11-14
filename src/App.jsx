import React, { useState, useMemo, useEffect, useRef } from 'react'
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function DiskSchedulerApp() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-gray-100"> 
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/run" element={<RunAlgo />} />
          <Route path="/about" element={<About />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </Router>
  )
}

function Navbar() {
  const [dark, setDark] = useState(true)
  return (
    <nav className="fixed w-full z-30 top-0 left-0">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-white/10 flex items-center justify-center">📀</div>
          <span className="font-semibold tracking-wide">DSA</span>
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

function Home() {
  const navigate = useNavigate()
  return (
    <header className="relative h-screen overflow-hidden">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1518241353330-62aab0f9e6c4?auto=format&fit=crop&w=1600&q=60" alt="vinyl" className="w-full h-full object-cover opacity-80 filter blur-sm" />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 py-32">
        <motion.div initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.6 }}>
          <h1 className="text-5xl md:text-6xl font-extrabold">Operating System Project</h1>
          <p className="mt-3 text-xl text-gray-200">Disk Scheduling Algorithm Visualiser</p>

          <div className="mt-8 flex gap-4">
            <button onClick={() => navigate('/run')} className="px-6 py-3 rounded-md bg-pink-600 text-white shadow-md">RUN ALGO</button>
            <button onClick={() => navigate('/about')} className="px-6 py-3 rounded-md bg-white/90 text-gray-900">About Us</button>
          </div>
        </motion.div>
      </div>
    </header>
  )
}

function About() {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-semibold mb-4">About Disk Scheduler Visualizer</h2>
      <p className="text-gray-300 leading-relaxed">This tool visualizes common disk scheduling algorithms (FCFS, SSTF, SCAN, C-SCAN, LOOK, C-LOOK). Enter a request queue and an initial head position, choose an algorithm and see the head movement as a Gantt-like timeline. Useful for learning and teaching operating systems concepts.</p>
      <p className="mt-4 text-gray-300">Built with React (JavaScript), Tailwind CSS, and a simple SVG visualizer.</p>
    </main>
  )
}



const ALGORITHMS = [ 'FCFS','SSTF','SCAN','CSCAN','LOOK','CLOOK' ]

function RunAlgo() {
  const [algorithm, setAlgorithm] = useState('FCFS')
  const [inputReqs, setInputReqs] = useState('98,183,37,122,14,124,65,67')
  const [head, setHead] = useState(53)
  const [maxTrack, setMaxTrack] = useState(199)
  const [direction, setDirection] = useState('right')
  const [result, setResult] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const intervalRef = useRef(null)

  function parseReqs(text){
    return text.split(',').map(s=>s.trim()).filter(s=>s!=='').map(Number).filter(n=>!Number.isNaN(n))
  }

  function run(){
    const reqs = parseReqs(inputReqs)
    if(reqs.length === 0) return setResult({error:'No requests provided'})
    const res = computeSchedule(algorithm, reqs, Number(head), Number(maxTrack), direction)
    setResult(res)
    // reset animation state
    setIsPlaying(false)
    setCurrentStep(0)
  }

  // play / pause effect
  useEffect(()=>{
    if(!result || result.error) return
    if(isPlaying){
      if(intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(()=>{
        setCurrentStep(s => {
          const last = Math.max(0, (result.fullPath||[]).length - 1)
          if(s >= last){
            clearInterval(intervalRef.current)
            intervalRef.current = null
            setIsPlaying(false)
            return last
          }
          return s+1
        })
      }, 700)
    } else {
      if(intervalRef.current){ clearInterval(intervalRef.current); intervalRef.current = null }
    }
    return ()=>{ if(intervalRef.current){ clearInterval(intervalRef.current); intervalRef.current=null } }
  },[isPlaying, result])

  return (
    <main className="max-w-6xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-semibold mb-6">Disk Scheduling Visualizer</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="p-6 bg-white/5 rounded-2xl">
          <label className="block text-sm text-gray-300">Algorithm</label>
          <select value={algorithm} onChange={e=>setAlgorithm(e.target.value)} className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10">
            {ALGORITHMS.map(a=> <option key={a} value={a}>{a}</option> )}
          </select>

          <label className="block text-sm text-gray-300 mt-4">Request queue (comma separated)</label>
          <textarea value={inputReqs} onChange={e=>setInputReqs(e.target.value)} rows={3} className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10" />

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div>
              <label className="block text-sm text-gray-300">Initial head</label>
              <input type="number" value={head} onChange={e=>setHead(e.target.value)} className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10" />
            </div>
            <div>
              <label className="block text-sm text-gray-300">Max track (0..N)</label>
              <input type="number" value={maxTrack} onChange={e=>setMaxTrack(e.target.value)} className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10" />
            </div>
          </div>

          {(algorithm==='SCAN' || algorithm==='CSCAN' || algorithm==='LOOK' || algorithm==='CLOOK') && (
            <div className="mt-4">
              <label className="block text-sm text-gray-300">Direction</label>
              <select value={direction} onChange={e=>setDirection(e.target.value)} className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10">
                <option value="right">Right (increasing)</option>
                <option value="left">Left (decreasing)</option>
              </select>
            </div>
          )}

          <div className="mt-6 flex gap-3">
            <button onClick={run} className="px-5 py-3 rounded-md bg-amber-600">Run Algorithm</button>
            <button onClick={()=>{ setInputReqs(''); setResult(null); setIsPlaying(false); setCurrentStep(0) }} className="px-5 py-3 rounded-md bg-white/5">Clear</button>
          </div>

          {result && result.error && <p className="mt-4 text-red-400">{result.error}</p>}

          {result && !result.error && (
            <div className="mt-4 text-sm text-gray-300">
              <p><strong>Seek sequence:</strong> {result.sequence.join(' → ')}</p>
              <p><strong>Total seek:</strong> {result.totalSeek}</p>
              <p><strong>Average seek:</strong> {(result.totalSeek / Math.max(1, result.sequence.length)).toFixed(2)}</p>
            </div>
          )}
        </section>

        <section className="p-6 bg-white/3 rounded-2xl">
          <div className="flex items-start justify-between">
            <h3 className="font-medium mb-3">Visualization</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => { if(result && !result.error) setCurrentStep(s=> Math.max(0, s-1)) }} className="px-3 py-1 rounded-md bg-white/5">Prev</button>
              <button onClick={() => { if(result && !result.error) setIsPlaying(p=>!p) }} className="px-3 py-1 rounded-md bg-amber-600">{isPlaying? 'Pause':'Play'}</button>
              <button onClick={() => { if(result && !result.error) setCurrentStep(s=> Math.min((result.fullPath||[]).length-1, s+1)) }} className="px-3 py-1 rounded-md bg-white/5">Next</button>
            </div>
          </div>

          {result && !result.error ? (
            <div className="grid md:grid-cols-2 gap-4">
              <DiskCylinder path={result.fullPath} maxTrack={Number(maxTrack)} currentStep={currentStep} />
              <GanttChart sequence={result.fullPath} headStart={Number(head)} maxTrack={Number(maxTrack)} currentStep={currentStep} />
            </div>
          ) : (
            <div className="text-gray-400">Run an algorithm to see the visualization here.</div>
          )}
        </section>
      </div>
    </main>
  )
}


function computeSchedule(algo, requests, head, maxTrack=199, direction='right'){

  const reqs = requests.slice()
  switch(algo){
    case 'FCFS': return fcfs(reqs, head)
    case 'SSTF': return sstf(reqs, head)
    case 'SCAN': return scan(reqs, head, maxTrack, direction, true)
    case 'CSCAN': return cscan(reqs, head, maxTrack, direction)
    case 'LOOK': return scan(reqs, head, maxTrack, direction, false)
    case 'CLOOK': return cscan(reqs, head, maxTrack, direction, true)
    default: return { error: 'Unknown algorithm' }
  }
}

function fcfs(reqs, head){
  const path = [head, ...reqs]
  const total = path.reduce((acc, cur, idx) => idx===0?0:acc+Math.abs(cur - path[idx-1]), 0)
  return { sequence: reqs, totalSeek: total, fullPath: path }
}

function sstf(reqs, head){
  const remaining = reqs.slice()
  const path = [head]
  let cur = head
  while(remaining.length){

    let idx = 0; let minDist = Infinity
    remaining.forEach((r,i)=>{ const d = Math.abs(r-cur); if(d<minDist){ minDist=d; idx=i } })
    const next = remaining.splice(idx,1)[0]
    path.push(next)
    cur = next
  }
  const total = path.reduce((acc, _,i)=> i===0?0: acc + Math.abs(path[i]-path[i-1]), 0)
  return { sequence: path.slice(1), totalSeek: total, fullPath: path }
}

function scan(reqs, head, maxTrack, direction='right', goToEnd=true){

  const sorted = [...new Set(reqs)].sort((a,b)=>a-b)
  const left = sorted.filter(x=>x < head).sort((a,b)=>b-a) // descending
  const right = sorted.filter(x=>x >= head).sort((a,b)=>a-b)
  const path = [head]
  if(direction === 'right'){

    for(const r of right) path.push(r)
    if(goToEnd && (right.length ===0 || right[right.length-1] !== maxTrack)) path.push(maxTrack)

    for(const l of left) path.push(l)
  } else {
    for(const l of left) path.push(l)
    if(goToEnd && (left.length === 0 || left[left.length-1] !== 0)) path.push(0)
    for(const r of right) path.push(r)
  }
  const total = path.reduce((acc, _,i)=> i===0?0: acc + Math.abs(path[i]-path[i-1]), 0)

  const compact = path.filter((v,i)=> i===0 || v!==path[i-1])
  return { sequence: compact.slice(1), totalSeek: total, fullPath: compact }
}

function cscan(reqs, head, maxTrack, direction='right', clook=false){
  const sorted = [...new Set(reqs)].sort((a,b)=>a-b)
  const left = sorted.filter(x=>x < head).sort((a,b)=>a-b)
  const right = sorted.filter(x=>x >= head).sort((a,b)=>a-b)
  const path = [head]
  if(direction === 'right'){
    for(const r of right) path.push(r)
    if(!clook) path.push(maxTrack)

    if(!clook) path.push(0)
    for(const l of left) path.push(l)
  } else {

    for(const l of left.slice().reverse()) path.push(l)
    if(!clook) path.push(0)
    if(!clook) path.push(maxTrack)
    for(const r of right.slice().reverse()) path.push(r)
  }
  const compact = path.filter((v,i)=> i===0 || v!==path[i-1])
  const total = compact.reduce((acc,_,i)=> i===0?0: acc + Math.abs(compact[i]-compact[i-1]), 0)
  return { sequence: compact.slice(1), totalSeek: total, fullPath: compact }
}



function GanttChart({ sequence = [], headStart = 0, maxTrack = 199, currentStep = 0 }){

  if(!sequence || sequence.length < 2) return <div className="text-gray-400">Not enough points to render.</div>


  const padding = 40
  const width = 900
  const height = 140
  const usable = width - padding*2
  const minTrack = 0
  const maxT = Number(maxTrack)
  const scale = v => padding + ( (v - minTrack) / Math.max(1, maxT - minTrack) ) * usable


  const segments = []
  for(let i=0;i<sequence.length-1;i++){
    const a = Number(sequence[i])
    const b = Number(sequence[i+1])
    segments.push({from:a, to:b, idx:i})
  }

  const activeSegment = Math.max(0, currentStep-1)


  const times = [0]
  for(let i=1;i<sequence.length;i++) times.push(times[i-1] + Math.abs(sequence[i]-sequence[i-1]))
  const total = times[times.length-1]

  return (
    <div className="overflow-auto">
      <svg width={Math.min(1000, width)} height={height} className="bg-black/20 rounded-md p-2">
        
        <line x1={padding} x2={width-padding} y1={height-40} y2={height-40} stroke="#ccc" strokeWidth={1} />
        
        {[0, Math.floor(maxT/4), Math.floor(maxT/2), Math.floor(3*maxT/4), maxT].map((t,i)=> (
          <g key={i}>
            <line x1={scale(t)} x2={scale(t)} y1={height-44} y2={height-36} stroke="#aaa" />
            <text x={scale(t)} y={height-18} fontSize={10} fill="#ddd" textAnchor="middle">{t}</text>
          </g>
        ))}

        
        {segments.map((s,i)=>{
          const x1 = scale(s.from)
          const x2 = scale(s.to)
          const y = 30 + (i % 6) * 12
          const isActive = i === activeSegment
          return (
            <g key={i}>
              <line x1={x1} x2={x2} y1={y} y2={y} stroke={isActive?"#6ee7b7":"#ffbf69"} strokeWidth={isActive?6:4} strokeLinecap="round" />
              <circle cx={x1} cy={y} r={isActive?4:3} fill="#ffd" />
              <text x={x1} y={y-6} fontSize={9} fill="#fff">{s.from}</text>
              {i===segments.length-1 && <text x={x2} y={y-6} fontSize={9} fill="#fff">{s.to}</text>}
            </g>
          )
        })}

        
        <text x={padding} y={18} fontSize={12} fill="#fff">Head path (left→right = track positions)</text>

        
        <g transform={`translate(${padding}, ${height-70})`}>
          <line x1={0} x2={usable} y1={0} y2={0} stroke="#666" strokeWidth={2} />
          {times.map((t,i)=>{
            const x = (t / Math.max(1, total)) * usable
            const isCurrent = i === currentStep
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={-6} y2={6} stroke={isCurrent?"#6ee7b7":"#999"} />
                <text x={x} y={18} fontSize={10} fill={isCurrent?"#fff":"#ddd"} textAnchor="middle">{sequence[i]}</text>
              </g>
            )
          })}
          
          {(() => {
            const cur = Number(sequence[Math.min(currentStep, sequence.length-1)])
            const x = (times[Math.min(currentStep, times.length-1)] / Math.max(1,total)) * usable
            return (
              <g>
                <circle cx={x} cy={0} r={6} fill="#60a5fa" />
                <text x={x} y={-10} fontSize={11} fill="#fff" textAnchor="middle">{cur}</text>
              </g>
            )
          })()}
        </g>

      </svg>

      <div className="mt-3 text-sm text-gray-300">Total movement = {total}</div>
    </div>
  )
}

    function DiskCylinder({ path = [], maxTrack = 199, currentStep = 0 }){
      
      const size = 320
      const cx = size/2
      const cy = size/2
      const rings = 10
      const sectors = 12
      const minR = 28
      const maxR = 120
      const maxT = Number(maxTrack) || 199

      const mapTrackToRadius = (t) => {
        const v = Math.max(0, Math.min(maxT, Number(t)))
        return minR + (v / Math.max(1, maxT)) * (maxR - minR)
      }

      const mapTrackToAngle = (t) => {
        
        const idx = Math.abs(Math.floor(Number(t))) % sectors
        return (idx / sectors) * Math.PI * 2 - Math.PI/2
      }

      const curTrack = path && path.length ? Number(path[Math.min(currentStep, path.length-1)]) : 0
      const headR = mapTrackToRadius(curTrack)
      const headAngle = mapTrackToAngle(curTrack)
      const headX = cx + headR * Math.cos(headAngle)
      const headY = cy + headR * Math.sin(headAngle)

      return (
        <div className="bg-black/10 rounded-md p-2 flex flex-col items-center">
          <svg width={size} height={size}>
            
            {[...Array(rings)].map((_,i)=>{
              const tVal = Math.round((i/(rings-1)) * maxT)
              const r = minR + (i/(rings-1)) * (maxR - minR)
              return (
                <g key={i}>
                  <circle cx={cx} cy={cy} r={r} stroke="#444" strokeWidth={1} fill="none" />
                  {i%2===0 && <text x={cx+r+8} y={cy + 4} fontSize={10} fill="#aaa">{tVal}</text>}
                </g>
              )
            })}

            
            {[...Array(sectors)].map((_,i)=>{
              const ang = (i / sectors) * Math.PI*2 - Math.PI/2
              const x = cx + maxR * Math.cos(ang)
              const y = cy + maxR * Math.sin(ang)
              return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#2a2a2a" strokeWidth={1} />
            })}

            
            {(path||[]).slice(0, 60).map((p, idx)=>{
              const r = mapTrackToRadius(p)
              const a = mapTrackToAngle(p)
              const x = cx + r * Math.cos(a)
              const y = cy + r * Math.sin(a)
              const visited = idx <= currentStep
              return <circle key={idx} cx={x} cy={y} r={visited?4:2} fill={visited? '#6ee7b7' : '#888'} />
            })}

            
            <motion.circle cx={headX} cy={headY} r={8} fill="#60a5fa" stroke="#93c5fd" strokeWidth={2} animate={{ cx: headX, cy: headY }} transition={{ type: 'spring', stiffness: 160, damping: 18 }} />

            
            <circle cx={cx} cy={cy} r={12} fill="#111" stroke="#333" />
            <text x={cx} y={cy+4} fontSize={11} fill="#fff" textAnchor="middle">Head</text>
          </svg>
          <div className="mt-2 text-sm text-gray-300">Track: <span className="font-semibold">{curTrack}</span></div>
        </div>
      )
    }

