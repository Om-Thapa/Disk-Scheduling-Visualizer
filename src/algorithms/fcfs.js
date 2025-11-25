export default function fcfs(processes = [], opts = {}){
  const procCopy = processes.map(p=> ({ ...p }))
  procCopy.sort((a,b)=> (a.arrival||0) - (b.arrival||0))
  const timeline = []
  let time = 0
  for(const p of procCopy){
    const start = Math.max(time, p.arrival || 0)
    const end = start + (p.burst || 0)
    timeline.push({ pid: p.pid, start, end })
    time = end
  }
  const order = timeline.map(t=>t.pid)
  return { processes: procCopy, timeline, order, totalTime: time }
}
