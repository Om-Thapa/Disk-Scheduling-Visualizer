export default function cscan(requests = [], head = 0, maxTrack = 199, direction='right', clook=false){
  const tmp = []
  const seen = {}
  for(let i=0;i<(requests||[]).length;i++){
    const n = Number(requests[i])
    if(Number.isNaN(n)) continue
    if(!seen[n]){ seen[n]=true; tmp.push(n) }
  }
  tmp.sort((a,b)=>a-b)

  const left = []
  const right = []
  for(let i=0;i<tmp.length;i++){
    if(tmp[i] < head) left.push(tmp[i])
    else right.push(tmp[i])
  }

  const path = [Number(head)]
  if(direction === 'right'){
    for(let i=0;i<right.length;i++) path.push(right[i])
    if(!clook){ path.push(Number(maxTrack)); path.push(0) }
    for(let i=0;i<left.length;i++) path.push(left[i])
  } else {
    for(let i=left.length-1;i>=0;i--) path.push(left[i])
    if(!clook){ path.push(0); path.push(Number(maxTrack)) }
    for(let i=right.length-1;i>=0;i--) path.push(right[i])
  }

  const compact = []
  for(let i=0;i<path.length;i++) if(i===0 || path[i] !== path[i-1]) compact.push(path[i])

  let total = 0
  for(let i=1;i<compact.length;i++) total += Math.abs(compact[i] - compact[i-1])

  return { sequence: compact.slice(1), totalSeek: total, fullPath: compact }
}
