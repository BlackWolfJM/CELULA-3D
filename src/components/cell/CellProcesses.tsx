import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'
import type { ProcessType } from '../../store/useStore'

const paths: Record<Exclude<ProcessType,'none'>, [number,number,number][]> = {
  protein: [[1.5,-0.5,-1.5],[0.8,-1.1,-1.3],[-0.5,0.3,-1.5],[-2,1,-1],[-1,1.8,0],[1,2.7,1],[4.7,1.2,1.1]],
  atp: [[2,1,2],[2.5,1.4,1.9],[2.4,0.5,2.3],[1.8,0.3,1.5],[1.5,1.2,2.6],[2.8,1.1,2.8],[2,1,2]],
  endocytosis: [[5.1,0.2,0],[4.7,0.2,0],[4.1,0,0],[3.5,-0.3,0],[2.6,-0.7,0.5],[1.7,-1.1,1.2]]
}

export const CellProcesses = () => {
  const simulation = useStore(s=>s.simulation)
  const playing = useStore(s=>s.simulationPlaying)
  const quality = useStore(s=>s.quality)
  const particles = useRef<THREE.Group>(null)
  const progress = useRef(0)
  const curve = useMemo(() => simulation==='none' ? null : new THREE.CatmullRomCurve3(paths[simulation].map(p=>new THREE.Vector3(...p)), simulation==='atp'), [simulation])
  const total = quality==='low' ? 5 : quality==='medium' ? 9 : 15
  useFrame((_,delta) => {
    if (!curve || !particles.current) return
    if (playing) progress.current += Math.min(delta,0.06)*0.11
    for (let i=0;i<particles.current.children.length;i++){
      const child=particles.current.children[i]
      const raw=(progress.current+i/total)%1
      const u=simulation==='atp' ? raw : Math.max(0.0001,Math.min(0.9999,raw))
      child.position.copy(curve.getPointAt(u))
      const scale=(simulation==='protein' ? 0.75 : 1) + Math.sin(progress.current*12+i)*0.16
      child.scale.setScalar(scale)
    }
  })
  if (!curve) return null
  const color = simulation==='protein' ? '#85e3db' : simulation==='atp' ? '#ffd987' : '#a8c5f9'
  return <group>
    <group ref={particles}>
      {Array.from({length:total},(_,i)=>
        <mesh key={i}>
          <sphereGeometry args={[simulation==='atp' ? 0.075 : 0.115, 10, 8]}/>
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.8} transparent opacity={0.9} />
        </mesh>
      )}
    </group>
  </group>
}
