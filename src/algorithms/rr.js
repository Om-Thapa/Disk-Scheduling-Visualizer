export default function rr(processes = [], opts = {}){
  const quantum = Math.max(1, Number(opts.quantum) || 2)
  const procs = processes.map(p=> ({ ...p, remaining: p.burst }))
  const timeline = []
  let time = 0

  const readyQueue = []
  const remaining = procs.slice()

  while(remaining.some(p=> (p.remaining||0) > 0)){
    // enqueue arrivals
    for(const p of remaining){
      if((p.arrival||0) <= time && !readyQueue.includes(p) && (p.remaining||0) > 0){
        readyQueue.push(p)
      }
    }

    if(readyQueue.length === 0){
      // advance to next arrival
      const nextArr = Math.min(...remaining.filter(p=> (p.remaining||0)>0).map(p=>p.arrival||0))
      time = Math.max(time, nextArr)
      continue
    }

    const cur = readyQueue.shift()
    const run = Math.min(quantum, cur.remaining||0)
    const start = time
    time += run
    cur.remaining -= run
    const end = time
    const last = timeline[timeline.length-1]
    if(last && last.pid === cur.pid && last.end === start){ last.end = end } else { timeline.push({ pid: cur.pid, start, end }) }

    // enqueue newly arrived during this quantum
    for(const p of remaining){
      if((p.arrival||0) > start && (p.arrival||0) <= time && (p.remaining||0) > 0 && !readyQueue.includes(p) && p !== cur){
        readyQueue.push(p)
      }
    }

    if(cur.remaining > 0) readyQueue.push(cur)
  }

  const order = Array.from(new Set(timeline.map(t=>t.pid)))
  return { processes: procs, timeline, order, totalTime: time }
}
