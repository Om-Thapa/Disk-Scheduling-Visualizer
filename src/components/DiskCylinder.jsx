import React from 'react'

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

  const pts = (path||[]).slice(0, 120)
  const n = pts.length || 1
  const activeIdx = Math.max(0, Math.min(currentStep, n - 1))
  const curTrack = pts.length ? Number(pts[activeIdx]) : 0

  const headR = mapTrackToRadius(curTrack)
  const headAngle = (activeIdx / n) * Math.PI * 2 - Math.PI/2
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

        {(() => {
          return pts.map((p, idx) => {
            const r = mapTrackToRadius(p)
            const a = (idx / n) * Math.PI * 2 - Math.PI / 2
            const x = cx + r * Math.cos(a)
            const y = cy + r * Math.sin(a)

            if(idx === activeIdx){
              return null
            }

            const isPast = idx < activeIdx
            const radius = isPast ? 3 : 2
            const fill = isPast ? '#6ee7b7' : '#666'
            const opacity = isPast ? 0.9 : 0.55
            return <circle key={idx} cx={x} cy={y} r={radius} fill={fill} opacity={opacity} />
          })
        })()}

        <g transform={`translate(${headX}, ${headY})`} style={{ transition: 'transform 0.45s ease' }}>
          <circle cx={0} cy={0} r={8} fill="#60a5fa" stroke="#93c5fd" strokeWidth={2} />
        </g>

        <circle cx={cx} cy={cy} r={12} fill="#111" stroke="#333" />
        <text x={cx} y={cy+4} fontSize={11} fill="#fff" textAnchor="middle">Head</text>
      </svg>
      <div className="mt-2 text-sm text-gray-300">Track: <span className="font-semibold">{curTrack}</span></div>
    </div>
  )
}
