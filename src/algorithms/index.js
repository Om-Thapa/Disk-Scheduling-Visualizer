import fcfs from './fcfs'
import sjf from './sjf'
import srtf from './srtf'
import rr from './rr'
import rm from './rm'
import edf from './edf'

export default function computeSchedule(algo, processes, opts = {}){
  const procs = (processes||[]).map(p=> ({ ...p }))
  switch(algo){
    case 'FCFS': return fcfs(procs, opts)
    case 'SJF': return sjf(procs, opts)
    case 'SRTF': return srtf(procs, opts)
    case 'RoundRobin': return rr(procs, opts)
    case 'RateMonotonic': return rm(procs, opts)
    case 'EDF': return edf(procs, opts)
    default: return { error: 'Unknown algorithm' }
  }
}
