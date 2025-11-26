// SCAN (elevator) algorithm
// go in one direction, serve requests, optionally go to end of disk, then reverse
export default function scan(requests = [], head = 0, maxTrack = 199, direction='right', goToEnd=true){
  // clean and sort unique requests
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
  // left should be descending for serving when moving left
  left.sort((a,b)=>b-a)

  const path = [Number(head)]
  if(direction === 'right'){
    for(let i=0;i<right.length;i++) path.push(right[i])
    if(goToEnd){
      const lastRight = right.length ? right[right.length-1] : null
      if(lastRight !== Number(maxTrack)) path.push(Number(maxTrack))
    }
    for(let i=0;i<left.length;i++) path.push(left[i])
  } else {
    for(let i=0;i<left.length;i++) path.push(left[i])
    if(goToEnd){
      const lastLeft = left.length ? left[left.length-1] : null
      if(lastLeft !== 0) path.push(0)
    }
    for(let i=0;i<right.length;i++) path.push(right[i])
  }

  // remove consecutive duplicates
  const compact = []
  for(let i=0;i<path.length;i++) if(i===0 || path[i] !== path[i-1]) compact.push(path[i])

  let total = 0
  for(let i=1;i<compact.length;i++) total += Math.abs(compact[i] - compact[i-1])

  return { sequence: compact.slice(1), totalSeek: total, fullPath: compact }
}
