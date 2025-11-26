import React from 'react'

export default function GanttChart({ sequence = [], headStart = 0, maxTrack = 199, currentStep = 0 }){
  if(!sequence || sequence.length < 2) return <div className="text-gray-400">Not enough points to render.</div>

  const padding = 40
  const width = 900
  const height = 160
  const usable = width - padding*2
  const maxT = Number(maxTrack)

  function scale(v){
    const t = Number(v)
    const frac = (t - 0) / Math.max(1, maxT - 0)
    return padding + frac * usable
  }

  const segments = []
  for(let i=0;i<sequence.length-1;i++){
    segments.push({ from: Number(sequence[i]), to: Number(sequence[i+1]), idx: i })
  }

  const times = [0]
  for(let i=1;i<sequence.length;i++) times.push(times[i-1] + Math.abs(Number(sequence[i]) - Number(sequence[i-1])))
  const total = times[times.length-1]

  const clampedStep = Math.max(0, Math.min(currentStep, sequence.length - 1))
  const activeSegment = Math.max(0, clampedStep - 1)

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
            const isCurrent = i === clampedStep
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={-6} y2={6} stroke={isCurrent?"#6ee7b7":"#999"} />
                <text x={x} y={18} fontSize={10} fill={isCurrent?"#fff":"#ddd"} textAnchor="middle">{sequence[i]}</text>
              </g>
            )
          })}

          {(() => {
            const cur = Number(sequence[Math.min(clampedStep, sequence.length-1)])
            const x = (times[Math.min(clampedStep, times.length-1)] / Math.max(1,total)) * usable
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
