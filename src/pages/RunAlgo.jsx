import React, { useState, useEffect } from 'react'
import computeSchedule from '../algorithms'
import GanttChart from '../components/GanttChart'
import DiskCylinder from '../components/DiskCylinder'

const ALGORITHMS = [ 'FCFS','SSTF','SCAN','CSCAN','LOOK','CLOOK' ]

export default function RunAlgo(){
  const [algorithm, setAlgorithm] = useState('FCFS')
  const [requestsText, setRequestsText] = useState('98,183,37,122,14,124,65,67')
  const [head, setHead] = useState(53)
  const [maxTrack, setMaxTrack] = useState(199)
  const [direction, setDirection] = useState('right')
  const [result, setResult] = useState(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [timerId, setTimerId] = useState(null)

  function parseRequests(text){
    return text.split(',').map(s=>s.trim()).filter(s=>s!=='').map(Number).filter(n=>!Number.isNaN(n))
  }

  function run(){
    const reqs = parseRequests(requestsText)
    if(reqs.length === 0) return setResult({ error: 'No requests defined' })
    const res = computeSchedule(algorithm, reqs, { head: Number(head), maxTrack: Number(maxTrack), direction })
    setResult(res)
    setIsPlaying(false)
    setCurrentStep(0)
    if(timerId){ clearTimeout(timerId); setTimerId(null) }
  }

  useEffect(()=>{

    return () => { if(timerId){ clearTimeout(timerId) } }
  }, [timerId])

  function togglePlay(){
    if(!result || result.error) return

    setIsPlaying(p => !p)
  }


  useEffect(() => {
    if(!isPlaying || !result || result.error) return
    const last = Math.max(0, (result.fullPath||[]).length - 1)
    if(currentStep >= last){
      setIsPlaying(false)
      return
    }
    const id = setTimeout(() => {
      setCurrentStep(s => Math.min(last, s + 1))
    }, 600)
    return () => clearTimeout(id)
  }, [isPlaying, currentStep, result])

  return (
    <main className="max-w-6xl mx-auto p-10 rounded-xl bg-amber-50/5 mt-22 mb-8">
      <h2 className="text-3xl font-semibold mb-6">Disk Scheduling Visualizer</h2>

      <div className="grid md:grid-cols-2 gap-6">
        <section className="p-6 bg-white/5 rounded-2xl">
          <label className="block font-semibold text-lg text-zinc-200 pl-1">Algorithm</label>
          <select value={algorithm} onChange={e=>setAlgorithm(e.target.value)} className="mt-3 w-full bg-transparent p-3 rounded-md border border-white/10">
            {ALGORITHMS.map(a=> <option className='bg-zinc-800 text-zinc-200' key={a} value={a}>{a}</option>)}
          </select>

          <label className="block text-sm text-gray-300 mt-4">Request queue (comma separated)</label>
          <textarea value={requestsText} onChange={e=>setRequestsText(e.target.value)} rows={3} className="mt-2 w-full bg-transparent p-3 rounded-md border border-white/10" />

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
            <button onClick={()=>{ setRequestsText(''); setResult(null); setIsPlaying(false); setCurrentStep(0) }} className="px-5 py-3 rounded-md bg-white/5">Clear</button>
          </div>

          {result && result.error && <p className="mt-4 text-red-400">{result.error}</p>}

          {result && !result.error && (
            <div className="mt-4 text-sm text-gray-300">
              <p><strong>Seek sequence:</strong> {result.sequence.join(' → ')}</p>
              <p><strong>Total seek:</strong> {result.totalSeek}</p>
              <p><strong>Average seek:</strong> {(result.totalSeek / Math.max(1, result.sequence.length)).toFixed(2)}</p>

              
              {result.timeline && result.timeline.length > 0 && (
                <div className="mt-4 overflow-auto">
                  <table className="w-full text-sm text-left border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 border-b">#</th>
                        <th className="p-2 border-b">Track</th>
                        <th className="p-2 border-b">Seek (time)</th>
                        <th className="p-2 border-b">Completion</th>
                        <th className="p-2 border-b">Waiting</th>
                        <th className="p-2 border-b">Turnaround</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.timeline.map((t, i) => (
                        <tr key={i} className="odd:bg-white/3">
                          <td className="p-2 border-b">{i+1}</td>
                          <td className="p-2 border-b">{t.track}</td>
                          <td className="p-2 border-b">{t.serviceDist}</td>
                          <td className="p-2 border-b">{t.completion}</td>
                          <td className="p-2 border-b">{t.waiting}</td>
                          <td className="p-2 border-b">{t.turnaround}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div className="mt-2 text-sm text-gray-300">
                    <p><strong>Avg turnaround:</strong> {result.metrics ? result.metrics.avgTurnaround.toFixed(2) : '—'}</p>
                    <p><strong>Avg waiting:</strong> {result.metrics ? result.metrics.avgWaiting.toFixed(2) : '—'}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </section>

        <section className="p-6 bg-white/3 rounded-2xl">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-lg mb-3">Visualization</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => { if(result && !result.error) setCurrentStep(s=> Math.max(0, s-1)) }} className="px-3 py-1 rounded-md bg-white/5">Prev</button>
              <button onClick={() => { togglePlay() }} className="px-3 py-1 rounded-md bg-amber-600">{isPlaying? 'Pause':'Play'}</button>
              <button onClick={() => { if(result && !result.error) setCurrentStep(s=> Math.min((result.fullPath||[]).length-1, s+1)) }} className="px-3 py-1 rounded-md bg-white/5">Next</button>
            </div>
          </div>

          {result && !result.error ? (
            <div className="grid md:grid-cols-1 gap-4">
              <GanttChart sequence={result.fullPath} headStart={Number(head)} maxTrack={Number(maxTrack)} currentStep={currentStep} />
              <DiskCylinder path={result.fullPath} maxTrack={Number(maxTrack)} currentStep={currentStep} />
            </div>
          ) : (
            <div className="text-gray-400 mt-2">Run an algorithm to see the visualization here.</div>
          )}
        </section>
      </div>
    </main>
  )
}
