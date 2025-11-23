export default function srtf(processes = [], opts = {}){
  const procs = processes.map(p=> ({ ...p, remaining: p.burst }))
  const timeline = []
  let time = 0
  const totalProcs = procs.length
  let finished = 0

  function allDone(){ return procs.every(p => (p.remaining||0) <= 0) }

  while(!allDone()){
    const available = procs.filter(p => (p.arrival||0) <= time && (p.remaining||0) > 0)
    if(available.length === 0){
      // jump to next arrival
      const nextArr = Math.min(...procs.filter(p=> (p.remaining||0)>0).map(p=>p.arrival||0))
      time = Math.max(time, nextArr)
      continue
    }
    available.sort((a,b)=> (a.remaining||0) - (b.remaining||0))
    const cur = available[0]
    // execute for 1 unit (fine-grained)
    const segStart = time
    cur.remaining = (cur.remaining||0) - 1
    time += 1
    const segEnd = time
    // merge with previous if same pid
    const last = timeline[timeline.length-1]
    if(last && last.pid === cur.pid && last.end === segStart){
      last.end = segEnd
    } else {
      timeline.push({ pid: cur.pid, start: segStart, end: segEnd })
    }
  }

  const order = Array.from(new Set(timeline.map(t=>t.pid)))
  return { processes: procs, timeline, order, totalTime: time }
}
