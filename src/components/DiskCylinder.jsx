import React from 'react'

export default function DiskCylinder({ processes = [], currentPid = null }){
  return (
    <div className="bg-black/10 rounded-md p-3">
      <h4 className="text-sm text-gray-200 mb-2">Processes</h4>
      <div className="flex flex-col gap-2">
        {(processes||[]).map(p=> (
          <div key={p.pid} className={`p-2 rounded-md ${currentPid===p.pid? 'bg-amber-600 text-black':'bg-white/5 text-gray-200'}`}>
            <div className="flex justify-between">
              <div className="font-medium">{p.pid}</div>
              <div className="text-xs">burst: {p.burst} arrival: {p.arrival}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
