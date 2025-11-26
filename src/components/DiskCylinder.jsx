import React from 'react'

// Simple DiskCylinder: shows concentric rings and the head position.
// This version avoids animation libraries so it's easy to understand for beginners.
export default function DiskCylinder({ path = [], maxTrack = 199, currentStep = 0 }){
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

        {(path||[]).slice(0, 120).map((p, idx)=>{
          const r = mapTrackToRadius(p)
          const a = mapTrackToAngle(p)
          const x = cx + r * Math.cos(a)
          const y = cy + r * Math.sin(a)
          const visited = idx <= currentStep
          return <circle key={idx} cx={x} cy={y} r={visited?4:2} fill={visited? '#6ee7b7' : '#888'} />
        })}

        {/* head marker — a plain SVG circle. We use a small CSS transition so it moves smoothly in modern browsers. */}
        <circle cx={headX} cy={headY} r={8} fill="#60a5fa" stroke="#93c5fd" strokeWidth={2} style={{ transition: 'cx 0.5s ease, cy 0.5s ease' }} />

        <circle cx={cx} cy={cy} r={12} fill="#111" stroke="#333" />
        <text x={cx} y={cy+4} fontSize={11} fill="#fff" textAnchor="middle">Head</text>
      </svg>
      <div className="mt-2 text-sm text-gray-300">Track: <span className="font-semibold">{curTrack}</span></div>
    </div>
  )
}
