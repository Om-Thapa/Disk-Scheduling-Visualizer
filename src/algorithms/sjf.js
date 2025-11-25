export default function sjf(processes = [], opts = {}){
  const procs = processes.map(p=> ({ ...p }))
  const timeline = []
  let time = 0
  const remaining = procs.slice()
  while(remaining.length){
    const available = remaining.filter(r => (r.arrival||0) <= time)
    let next
    if(available.length === 0){
      // jump to next arrival
      const nextArr = Math.min(...remaining.map(r=>r.arrival||0))
      time = Math.max(time, nextArr)
      continue
    } else {
      available.sort((a,b)=> (a.burst||0) - (b.burst||0))
      next = available[0]
    }
    const idx = remaining.indexOf(next)
    remaining.splice(idx,1)
    const start = Math.max(time, next.arrival||0)
    const end = start + (next.burst||0)
    timeline.push({ pid: next.pid, start, end })
    time = end
  }
  const order = timeline.map(t=>t.pid)
  return { processes: procs, timeline, order, totalTime: time }
}
