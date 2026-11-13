import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { useStore } from '../../store/useStore'

export const Cytoskeleton = () => {
  const groupRef=useRef<THREE.Group>(null)
  const select=useStore(s=>s.setSelectedOrganelle)
  const hover=useStore(s=>s.setHoveredOrganelle)
  const microtubules=useMemo(()=>{
    const anchor=new THREE.Vector3(0,-1.8,0.5)
    return Array.from({length:18},(_,i)=>{
      const phi=i*2.399963
      const z=1-(i/17)*2
      const r=Math.sqrt(1-z*z)
      const destination=new THREE.Vector3(r*Math.cos(phi)*4.1,r*Math.sin(phi)*4.1,z*4.1)
      return [anchor,destination] as [THREE.Vector3,THREE.Vector3]
    })
  },[])
  const actin=useMemo(()=>Array.from({length:14},(_,i)=>{
    const a=i/14*Math.PI*2
    const z=(i%5-2)*0.65
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(4.2*Math.cos(a),4.2*Math.sin(a),z),
      new THREE.Vector3(4.5*Math.cos(a+0.2),4.5*Math.sin(a+0.2),z+0.05),
      new THREE.Vector3(4.2*Math.cos(a+0.44),4.2*Math.sin(a+0.44),z-0.04)
    ]).getPoints(18)
  }),[])
  return <group ref={groupRef}
    onPointerDown={e=>{e.stopPropagation();select('Cytoskeleton',new THREE.Vector3(0,-1.8,0.5))}}
    onPointerOver={e=>{e.stopPropagation();hover('Cytoskeleton');document.body.style.cursor='pointer'}}
    onPointerOut={()=>{hover(null);document.body.style.cursor='auto'}}>
    {microtubules.map((points,i)=><Line key={i} points={points} color="#538fdb" lineWidth={1.2} transparent opacity={0.45}/>)}
    {actin.map((points,i)=><Line key={i} points={points} color="#b9638e" lineWidth={1} transparent opacity={0.48}/>)}
  </group>
}
