export default function sstf(requests = [], head = 0){
  const remaining = []
  for(let i=0;i<(requests||[]).length;i++){
    const n = Number(requests[i])
    if(!Number.isNaN(n)) remaining.push(n)
  }

  const path = [Number(head)]
  let cur = Number(head)

  while(remaining.length > 0){
    let bestIdx = 0
    let bestDist = Math.abs(remaining[0] - cur)
    for(let i=1;i<remaining.length;i++){
      const d = Math.abs(remaining[i] - cur)
      if(d < bestDist){ bestDist = d; bestIdx = i }
    }
    const next = remaining.splice(bestIdx, 1)[0]
    path.push(next)
    cur = next
  }

  let total = 0
  for(let i=1;i<path.length;i++) total += Math.abs(path[i] - path[i-1])

  return { sequence: path.slice(1), totalSeek: total, fullPath: path }
}
