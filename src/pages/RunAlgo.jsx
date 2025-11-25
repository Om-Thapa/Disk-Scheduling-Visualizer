import React, { useState, useRef, useEffect } from 'react'
import computeSchedule from '../algorithms'
import GanttChart from '../components/GanttChart'
import DiskCylinder from '../components/DiskCylinder'

const ALGORITHMS = [
  'FCFS',
  'SJF', // non-preemptive
  'SRTF',
  'RoundRobin',
  'RateMonotonic',
  'EDF'
]

export default function RunAlgo(){
  const [algorithm, setAlgorithm] = useState('FCFS')
  const [procText, setProcText] = useState('P1,0,8\nP2,1,4\nP3,2,9\nP4,3,9')
  const [quantum, setQuantum] = useState(2)
  const [horizon, setHorizon] = useState(50)
  const [result, setResult] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const intervalRef = useRef(null)

  function parseProcesses(text){
    const lines = text.split('\n').map(l=>l.trim()).filter(l=>l)
    const procs = []
    let autoId = 1
    for(const ln of lines){
      const parts = ln.split(',').map(p=>p.trim())
      if(parts.length < 2) continue
      let pid = parts[0]
      let arrival = Number(parts[1])
      let burst = Number(parts[2] ?? parts[1])
      
      if(parts.length === 2){ 
        pid = `P${autoId++}`
        arrival = Number(parts[0])
        burst = Number(parts[1])
      }
      const period = parts[3] ? Number(parts[3]) : undefined
      const deadline = parts[4] ? Number(parts[4]) : undefined
      procs.push({ pid, arrival: isNaN(arrival)?0:arrival, burst: isNaN(burst)?0:burst, remaining: isNaN(burst)?0:burst, period, deadline })
    }
    return procs
  }

  function run(){
    const procs = parseProcesses(procText)
    if(procs.length === 0) return setResult({ error: 'No processes defined' })
    const res = computeSchedule(algorithm, procs, { quantum: Number(quantum), horizon: Number(horizon) })
    setResult(res)
    setIsPlaying(false)
    setCurrentStep(0)
  }

  useEffect(()=>{
    if(!result || result.error) return
    if(isPlaying){
      if(intervalRef.current) clearInterval(intervalRef.current)
      intervalRef.current = setInterval(()=>{
        setCurrentStep(s => {
          const last = Math.max(0, (result.timeline||[]).length - 1)
          if(s >= last){
            clearInterval(intervalRef.current)
            intervalRef.current = null
            setIsPlaying(false)
            return last
          }
          return s+1
        })
      }, 600)
    } else {
      if(intervalRef.current){ clearInterval(intervalRef.current); intervalRef.current = null }
    }
    return ()=>{ if(intervalRef.current){ clearInterval(intervalRef.current); intervalRef.current=null } }
  },[isPlaying, result])

  return (
    <main className="max-w-6xl mx-auto p-10 rounded-xl bg-amber-50/5 mt-22 mb-8">
      <h2 className="text-3xl font-semibold mb-6">Scheduling Visualizer</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="p-6 bg-white/5 rounded-2xl">
          <label className="block font-semibold text-lg text-zinc-200 pl-1">Algorithm</label>
          <select value={algorithm} onChange={e=>setAlgorithm(e.target.value)} className="mt-3 w-full bg-transparent p-3 rounded-md border border-white/10">
            {ALGORITHMS.map(a=> <option className='bg-zinc-800 text-zinc-200' key={a} value={a}>{a}</option>)}
          </select>

          <label className="block text-sm text-gray-300 mt-4">Processes (one per line)</label>
          <textarea value={procText} onChange={e=>setProcText(e.target.value)} rows={6} className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10" />
          <p className="text-xs text-gray-400 mt-2">Format: <em>pid,arrival,burst[,period][,deadline]</em>. If pid is omitted provide numeric pairs.</p>

          {algorithm === 'RoundRobin' && (
            <div className="mt-4">
              <label className="block text-sm text-gray-300">Quantum</label>
              <input type="number" value={quantum} onChange={e=>setQuantum(e.target.value)} className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10" />
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm text-gray-300">Horizon (simulation time limit)</label>
            <input type="number" value={horizon} onChange={e=>setHorizon(e.target.value)} min="1" className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10" />
            <p className="text-xs text-gray-400 mt-1">Maximum time units to simulate. Increase for long-running tasks.(Recommended : 30</p>
          </div>

          <div className="mt-6 flex gap-3">
            <button onClick={run} className="px-5 py-3 rounded-md bg-amber-600">Run Algorithm</button>
            <button onClick={()=>{ setProcText(''); setResult(null); setIsPlaying(false); setCurrentStep(0) }} className="px-5 py-3 rounded-md bg-white/5">Clear</button>
          </div>

          {result && result.error && <p className="mt-4 text-red-400">{result.error}</p>}

          {result && !result.error && (
            <div className="mt-4 text-sm text-gray-300">
              <p><strong>Order:</strong> {result.timeline ? result.timeline.map((p) => p.pid).join(' → ') : '—'}</p>
              <p><strong>Total time:</strong> {result.totalTime}</p>
            </div>
          )}
        </section>

        <section className="p-6 bg-white/3 rounded-2xl">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg mb-3">Visualization</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => { if(result && !result.error) setCurrentStep(s=> Math.max(0, s-1)) }} className="px-3 py-1 rounded-md bg-white/5">Prev</button>
              <button onClick={() => { if(result && !result.error) setIsPlaying(p=>!p) }} className="px-3 py-1 rounded-md bg-amber-600">{isPlaying? 'Pause':'Play'}</button>
              <button onClick={() => { if(result && !result.error) setCurrentStep(s=> Math.min((result.timeline||[]).length-1, s+1)) }} className="px-3 py-1 rounded-md bg-white/5">Next</button>
            </div>
          </div>

          {result && !result.error ? (
            <div className="grid md:grid-cols-1 gap-4">
              <GanttChart timeline={result.timeline} currentStep={currentStep} />
              <DiskCylinder processes={result.processes} currentPid={result.timeline && result.timeline[Math.min(currentStep, (result.timeline||[]).length-1)]?.pid} />
            </div>
          ) : (
            <div className="text-gray-400 mt-2">Run an algorithm to see the visualization here.</div>
          )}
        </section>
      </div>
    </main>
  )
}
