import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float } from '@react-three/drei'
import { useStore } from '../../store/useStore'

export const Nucleus=()=>{
  const nucleolus=useRef<THREE.Mesh>(null)
  const group=useRef<THREE.Group>(null)
  const select=useStore(s=>s.setSelectedOrganelle)
  const hover=useStore(s=>s.setHoveredOrganelle)
  const pores=useMemo(()=>Array.from({length:27},(_,i)=>{
    const y=1-2*(i+0.5)/27
    const radius=Math.sqrt(1-y*y)
    const angle=i*2.39996322972865
    return [1.51*radius*Math.cos(angle),1.51*y,1.51*radius*Math.sin(angle)] as [number,number,number]
  }),[])
  useFrame(({clock})=>{
    if(!nucleolus.current)return
    const s=1+Math.sin(clock.getElapsedTime()*1.1)*0.025
    nucleolus.current.scale.setScalar(s)
  })
  return <group ref={group}>
    <Float speed={0.6} rotationIntensity={0.1} floatIntensity={0.14}>
      <group
        onPointerDown={e=>{e.stopPropagation();select('Nucleus',new THREE.Vector3())}}
        onPointerOver={e=>{e.stopPropagation();hover('Nucleus');document.body.style.cursor='pointer'}}
        onPointerOut={()=>{hover(null);document.body.style.cursor='auto'}}>
        <mesh>
          <sphereGeometry args={[1.52,48,32]}/>
          <meshPhysicalMaterial color="#7469b6" transparent opacity={0.62} roughness={0.34}
            side={THREE.DoubleSide} depthWrite={false}/>
        </mesh>
        <mesh>
          <sphereGeometry args={[1.44,40,26]}/>
          <meshStandardMaterial color="#7e6db2" transparent opacity={0.19} depthWrite={false}/>
        </mesh>
        <mesh ref={nucleolus} position={[0.2,0,-0.12]}>
          <sphereGeometry args={[0.5,28,22]}/>
          <meshStandardMaterial color="#aa90d8" emissive="#6943ac" emissiveIntensity={0.23}/>
        </mesh>
        {pores.map((p,i)=><mesh key={i} position={p} scale={[0.07,0.07,0.07]}>
          <sphereGeometry args={[1,8,6]}/>
          <meshStandardMaterial color="#b6addf" emissive="#736cb1" emissiveIntensity={0.13}/>
        </mesh>)}
      </group>
    </Float>
  </group>
}
