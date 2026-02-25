import { useRef } from 'react'
import * as THREE from 'three'
import { Float } from '@react-three/drei'
import { Ribosomes } from './Ribosomes'
import { useStore } from '../../store/useStore'

export const Reticulum = ({ type = 'rugoso' as 'rugoso' | 'liso', position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) => {
    const groupRef = useRef<THREE.Group>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    const id = type === 'rugoso' ? 'Rough ER' : 'Smooth ER'

    return (
        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5} position={position} rotation={rotation}>
            <group
                ref={groupRef}
                onPointerDown={(e) => {
                    e.stopPropagation()
                    const worldPos = new THREE.Vector3()
                    groupRef.current?.getWorldPosition(worldPos)
                    setSelectedOrganelle(id, worldPos)
                }}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoveredOrganelle(id)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHoveredOrganelle(null)
                    document.body.style.cursor = 'auto'
                }}
            >
                {[0, 0.3, 0.6].map((offset, i) => (
                    <mesh key={i} position={[0, 0, offset]}>
                        <boxGeometry args={[2, 1.5, 0.1, 10, 10]} />
                        <meshStandardMaterial
                            color={type === 'rugoso' ? "#2E8B57" : "#3CB371"}
                            roughness={0.8}
                        />
                    </mesh>
                ))}

                {type === 'rugoso' && (
                    <Ribosomes count={100} area={[2, 1.5, 0.5]} />
                )}
            </group>
        </Float>
    )
}
