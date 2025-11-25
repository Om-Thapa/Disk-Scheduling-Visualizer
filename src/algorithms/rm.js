export default function rm(processes = [], opts = {}){
  const horizon = Number(opts.horizon) || 100
  // ensure period exists; fallback to a large value
  const tasks = processes.map(p=> ({ ...p, period: p.period || (p.burst || 1), relativeDeadline: p.deadline }))

  // generate job releases up to horizon
  const jobs = []
  for(const t of tasks){
    const start = t.arrival || 0
    for(let k = 0; k <= Math.floor((horizon - start) / t.period); k++){
      const release = start + k * t.period
      const job = { pid: t.pid, release, remaining: t.burst || 0, deadline: release + (t.relativeDeadline || t.period) }
      jobs.push(job)
    }
  }

  let time = 0
  const timeline = []

  while(time < horizon && jobs.some(j=> j.remaining > 0)){
    const ready = jobs.filter(j=> j.release <= time && j.remaining > 0)
    if(ready.length === 0){ time++; continue }
    // RM priority: shorter period => higher priority. Find task period from original list
    ready.sort((a,b)=>{
      const ta = processes.find(p=>p.pid===a.pid)?.period || (processes.find(p=>p.pid===a.pid)?.burst||1)
      const tb = processes.find(p=>p.pid===b.pid)?.period || (processes.find(p=>p.pid===b.pid)?.burst||1)
      return ta - tb
    })
    const cur = ready[0]
    const start = time
    cur.remaining -= 1
    time += 1
    const end = time
    const last = timeline[timeline.length-1]
    if(last && last.pid === cur.pid && last.end === start) last.end = end
    else timeline.push({ pid: cur.pid, start, end })
  }

  const order = Array.from(new Set(timeline.map(t=>t.pid)))
  return { processes: processes.map(p=> ({...p})), timeline, order, totalTime: time }
}
