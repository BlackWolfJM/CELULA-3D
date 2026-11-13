import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Float } from '@react-three/drei'
import { useStore } from '../../store/useStore'

type Props={position?:[number,number,number];rotation?:[number,number,number]}
export const Mitochondria=({position=[0,0,0],rotation=[0,0,0]}:Props)=>{
  const groupRef=useRef<THREE.Group>(null)
  const select=useStore(s=>s.setSelectedOrganelle)
  const hover=useStore(s=>s.setHoveredOrganelle)
  const stress=useStore(s=>s.condition==='stress')
  const mode=useStore(s=>s.mode)
  const curves=useMemo(()=>Array.from({length:7},(_,i)=>{
    const y=(i-3)*0.17
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.32,y,0),
      new THREE.Vector3(-0.12,y+0.085,0.1),
      new THREE.Vector3(0.06,y-0.09,-0.06),
      new THREE.Vector3(0.3,y,0)
    ])
  }),[])
  return <Float speed={1.1} rotationIntensity={0.2} floatIntensity={0.25} position={position} rotation={rotation}>
    <group ref={groupRef}
      onPointerDown={e=>{e.stopPropagation();const p=new THREE.Vector3();groupRef.current?.getWorldPosition(p);select('Mitochondria',p)}}
      onPointerOver={e=>{e.stopPropagation();hover('Mitochondria');document.body.style.cursor='pointer'}}
      onPointerOut={()=>{hover(null);document.body.style.cursor='auto'}}>
      <mesh>
        <capsuleGeometry args={[0.45,0.95,8,24]}/>
        <meshPhysicalMaterial color={stress?'#dc7468':'#e99b72'} roughness={0.35}
          transparent opacity={mode==='fluorescence'?0.75:0.64} side={THREE.DoubleSide} depthWrite={false}
          emissive={stress?'#a73731':'#4a180e'} emissiveIntensity={stress?0.4:0.05}/>
      </mesh>
      <mesh scale={[0.79,0.87,0.76]}>
        <capsuleGeometry args={[0.44,0.95,6,20]}/>
        <meshStandardMaterial color="#ba704e" transparent opacity={0.38} roughness={0.7} depthWrite={false}/>
      </mesh>
      {curves.map((curve,i)=>
        <mesh key={i}><tubeGeometry args={[curve,28,0.026,7,false]}/>
          <meshStandardMaterial color={mode==='fluorescence'?'#ffe9b4':'#ffd7ae'}
            emissive={mode==='fluorescence'?'#ffd46c':'#754126'}
            emissiveIntensity={mode==='fluorescence'?1.6:0.22}/>
        </mesh>
      )}
    </group>
  </Float>
}
