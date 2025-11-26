import fcfs from './fcfs'
import sstf from './sstf'
import scan from './scan'
import cscan from './cscan'
import look from './look'
import clook from './clook'

// computeSchedule for disk scheduling algorithms
// processes parameter is used as a request array in disk scheduling context
export default function computeSchedule(algo, requests = [], opts = {}){
  const reqs = (Array.isArray(requests) ? requests.slice() : [])
  let res
  switch(algo){
    case 'FCFS': res = fcfs(reqs, opts.head); break
    case 'SSTF': res = sstf(reqs, opts.head); break
    case 'SCAN': res = scan(reqs, opts.head, opts.maxTrack, opts.direction); break
    case 'CSCAN': res = cscan(reqs, opts.head, opts.maxTrack, opts.direction); break
    case 'LOOK': res = look(reqs, opts.head, opts.maxTrack, opts.direction); break
    case 'CLOOK': res = clook(reqs, opts.head, opts.maxTrack, opts.direction); break
    default: return { error: 'Unknown algorithm' }
  }

  // simple timing metrics: treat seek distance as time units
  try{
    if(!res || !res.fullPath || res.fullPath.length < 2) return res
    const path = res.fullPath.slice()
    const timeline = []
    let cum = 0
    for(let i=1;i<path.length;i++){
      const from = Number(path[i-1])
      const to = Number(path[i])
      const serviceDist = Math.abs(to - from)
      cum += serviceDist
      const completion = cum
      const waiting = completion - serviceDist
      const turnaround = completion // arrival assumed 0
      timeline.push({ track: to, serviceDist, completion, waiting, turnaround, step: i })
    }
    const n = timeline.length
    const avgTurnaround = n ? (timeline.reduce((s,t)=>s+t.turnaround,0)/n) : 0
    const avgWaiting = n ? (timeline.reduce((s,t)=>s+t.waiting,0)/n) : 0
    res.timeline = timeline
    res.metrics = { avgTurnaround, avgWaiting, requestsServed: n }
    if(typeof res.totalSeek === 'undefined') res.totalSeek = cum
    return res
  }catch(e){
    return res
  }
}
