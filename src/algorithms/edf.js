export default function edf(processes = [], opts = {}){
  const horizon = Number(opts.horizon) || 100
  const tasks = processes.map(p=> ({ ...p, period: p.period, relativeDeadline: p.deadline }))
  const jobs = []
  for(const t of tasks){
    const start = t.arrival || 0
    const per = t.period || horizon
    if(t.period){
      for(let k=0;k<=Math.floor((horizon-start)/per);k++){
        const release = start + k*per
        const deadline = release + (t.relativeDeadline || per)
        jobs.push({ pid: t.pid, release, remaining: t.burst||0, deadline })
      }
    } else {
      // single job
      jobs.push({ pid: t.pid, release: t.arrival||0, remaining: t.burst||0, deadline: (t.deadline? (t.arrival||0)+t.deadline : (t.arrival||0) + (t.burst||0)) })
    }
  }

  let time = 0
  const timeline = []

  while(time < horizon && jobs.some(j=> j.remaining > 0)){
    const ready = jobs.filter(j=> j.release <= time && j.remaining > 0)
    if(ready.length === 0){ time++; continue }
    ready.sort((a,b)=> a.deadline - b.deadline)
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
