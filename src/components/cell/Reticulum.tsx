import { useMemo, useRef } from 'react'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

type Props = {type?: 'rugoso' | 'liso'; position?: [number,number,number]; rotation?: [number,number,number]}
export const Reticulum = ({ type='rugoso', position=[0,0,0], rotation=[0,0,0] }:Props) => {
  const groupRef = useRef<THREE.Group>(null)
  const select = useStore(s=>s.setSelectedOrganelle)
  const hover = useStore(s=>s.setHoveredOrganelle)
  const stress = useStore(s=>s.condition === 'stress')
  const id = type === 'rugoso' ? 'Rough ER' : 'Smooth ER'
  const curves = useMemo(() => Array.from({length:type==='rugoso'?5:7},(_,i) => {
    const y = (i-2)*0.3
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.05,y,-0.26),
      new THREE.Vector3(-0.5,y+Math.sin(i)*0.12,0.08),
      new THREE.Vector3(0.1,y-0.15,-0.25),
      new THREE.Vector3(0.55,y+0.08,0.13),
      new THREE.Vector3(1.05,y,0.05)
    ])
  }),[type])
  const ribosomePositions=useMemo(()=>type==='rugoso' ?
    curves.flatMap(curve=>Array.from({length:15},(_,i) => curve.getPoint((i+0.3)/16).add(new THREE.Vector3(0,0.095,0)))) : [],[curves,type])
  return <Float speed={0.8} rotationIntensity={0.08} floatIntensity={0.2} position={position} rotation={rotation}>
    <group ref={groupRef} onPointerDown={e => {
      e.stopPropagation()
      const p = new THREE.Vector3()
      groupRef.current?.getWorldPosition(p)
      select(id,p)
    }} onPointerOver={e=>{e.stopPropagation();hover(id);document.body.style.cursor='pointer'}}
      onPointerOut={()=>{hover(null);document.body.style.cursor='auto'}}>
      {curves.map((curve,i)=>
        <mesh key={i}><tubeGeometry args={[curve,56,type==='rugoso'?0.085:0.065,10,false]}/>
          <meshStandardMaterial color={stress ? '#bb7c89' : type==='rugoso'?'#397f8e':'#4ea29a'} roughness={0.53} metalness={0.12}/>
        </mesh>
      )}
      {ribosomePositions.map((p,i)=>
        <mesh key={i} position={p.toArray()}>
          <sphereGeometry args={[0.045,7,6]}/>
          <meshStandardMaterial color="#b2e1f3" roughness={0.9}/>
        </mesh>
      )}
    </group>
  </Float>
}
