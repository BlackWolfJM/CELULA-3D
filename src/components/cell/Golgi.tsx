import { useRef } from 'react'
import * as THREE from 'three'
import { Float } from '@react-three/drei'
import { useStore } from '../../store/useStore'

type Props={position?:[number,number,number];rotation?:[number,number,number]}
export const Golgi=({position=[0,0,0],rotation=[0,0,0]}:Props)=>{
  const ref=useRef<THREE.Group>(null)
  const select=useStore(s=>s.setSelectedOrganelle)
  const hover=useStore(s=>s.setHoveredOrganelle)
  return <Float speed={0.9} rotationIntensity={0.12} floatIntensity={0.25} position={position} rotation={rotation}>
    <group ref={ref} onPointerDown={e=>{e.stopPropagation();const p=new THREE.Vector3();ref.current?.getWorldPosition(p);select('Golgi',p)}}
      onPointerOver={e=>{e.stopPropagation();hover('Golgi');document.body.style.cursor='pointer'}}
      onPointerOut={()=>{hover(null);document.body.style.cursor='auto'}}>
      {Array.from({length:6},(_,i)=>
        <mesh key={i} position={[0,(i-2.5)*0.17,0]} rotation={[0,0,Math.sin(i*0.8)*0.12]} scale={[1-i*0.055,0.075,0.47-i*0.012]}>
          <sphereGeometry args={[1,32,16]}/>
          <meshStandardMaterial color={i<3?'#dbb86e':'#e7ae6f'} roughness={0.45} metalness={0.07}/>
        </mesh>
      )}
      {Array.from({length:8},(_,i)=>
        <mesh key={'v'+i} position={[Math.cos(i*2.1)*1.07,(i%5-2)*0.19,Math.sin(i*2.1)*0.43]}>
          <sphereGeometry args={[0.075+(i%3)*0.018,12,10]}/>
          <meshStandardMaterial color="#e6c287" roughness={0.55}/>
        </mesh>
      )}
    </group>
  </Float>
}
