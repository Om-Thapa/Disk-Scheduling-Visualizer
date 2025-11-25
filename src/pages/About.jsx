import React from 'react'

export default function About(){
  return (
    <main className="max-w-4xl mx-auto p-10 rounded-xl mt-24 bg-amber-50/5 backdrop-blur-lg">
      <h2 className="text-3xl font-bold mb-4">About Scheduler Visualizer</h2>
      <p className="text-gray-300 leading-relaxed">This tool visualizes several scheduling algorithms (FCFS, SJF non-preemptive, SRTF, Round Robin, Rate Monotonic, Earliest Deadline First). Provide processes in the format described in the Run page and see a Gantt-style visualization.</p>
      <p className="mt-4 text-gray-300">Built with React and a shader background for aesthetics.</p>
    </main>
  )
}
