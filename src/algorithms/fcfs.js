// FCFS for disk scheduling (First-Come First-Serve)
// Input: requests = array of track numbers, head = starting track
// Output: { sequence, totalSeek, fullPath }
export default function fcfs(requests = [], head = 0){
  // make a clean array of numbers
  const reqs = []
  for(let i=0;i<(requests||[]).length;i++){
    const n = Number(requests[i])
    if(!Number.isNaN(n)) reqs.push(n)
  }

  const path = [Number(head)]
  for(let i=0;i<reqs.length;i++) path.push(reqs[i])

  // compute total seek distance (time)
  let total = 0
  for(let i=1;i<path.length;i++) total += Math.abs(path[i] - path[i-1])

  return { sequence: reqs, totalSeek: total, fullPath: path }
}
