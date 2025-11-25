import React from 'react'

export default function GanttChart({ timeline = [], currentStep = 0 }){
  if(!timeline || timeline.length === 0) return <div className="text-gray-400">No timeline to render.</div>

  const width = 900
  const height = 180
  const padding = 40

  const totalEnd = Math.max(...timeline.map(t => t.end), 0)
  const usable = width - padding * 2
  const scale = (t) => padding + (t / Math.max(1, totalEnd)) * usable

  return (
    <div className="overflow-auto thin-scrollbar">
      <svg width={Math.min(1000, width)} height={height} className="bg-black/20 rounded-md p-2 my-2">
        <text x={12} y={18} fontSize={12} fill="#fff">Gantt Chart (time left → right)</text>

        {timeline.map((seg, i)=>{
          const x = scale(seg.start)
          const x2 = scale(seg.end)
          const y = 40 + (i % 6) * 18
          const isActive = i === currentStep
          return (
            <g key={i}>
              <rect x={x} y={y} width={Math.max(2, x2-x)} height={14} rx={4} fill={isActive? '#60a5fa' : '#ffbf69'} />
              <text x={x+6} y={y+10} fontSize={11} fill="#000">{seg.pid}</text>
              <text x={x2+6} y={y+10} fontSize={10} fill="#ddd">{seg.end}</text>
            </g>
          )
        })}

        <g transform={`translate(${padding}, ${height-20})`}>
          <line x1={0} x2={usable} y1={0} y2={0} stroke="#666" strokeWidth={2} />
          {[...Array(6)].map((_,i)=>{
            const t = Math.round((i/5) * totalEnd)
            const x = (t / Math.max(1, totalEnd)) * usable
            return (
              <g key={i}>
                <line x1={x} x2={x} y1={-6} y2={6} stroke="#999" />
                <text x={x} y={18} fontSize={10} fill="#ddd" textAnchor="middle">{t}</text>
              </g>
            )
          })}
        </g>
      </svg>
    </div>
  )
}
