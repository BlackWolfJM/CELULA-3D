import { useRef } from 'react'
import * as THREE from 'three'
import { Float, Sphere } from '@react-three/drei'
import { useStore } from '../../store/useStore'

export const Golgi = ({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) => {
    const groupRef = useRef<THREE.Group>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={position} rotation={rotation}>
            <group
                ref={groupRef}
                onPointerDown={(e) => {
                    e.stopPropagation()
                    const worldPos = new THREE.Vector3()
                    groupRef.current?.getWorldPosition(worldPos)
                    setSelectedOrganelle('Golgi', worldPos)
                }}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoveredOrganelle('Golgi')
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHoveredOrganelle(null)
                    document.body.style.cursor = 'auto'
                }}
            >
                {[0, 0.2, 0.4, 0.6].map((offset, i) => (
                    <mesh key={i} position={[0, offset, 0]} rotation={[Math.PI / 2, 0, 0]}>
                        <torusGeometry args={[1 - offset * 0.5, 0.1, 16, 32, Math.PI * 0.8]} />
                        <meshStandardMaterial color="#F4C430" roughness={0.3} />
                    </mesh>
                ))}
                <Sphere args={[0.1, 16, 16]} position={[1.2, 0.5, 0]}>
                    <meshStandardMaterial color="#FFF176" />
                </Sphere>
                <Sphere args={[0.08, 16, 16]} position={[-1.2, 0.2, 0.3]}>
                    <meshStandardMaterial color="#FFF176" />
                </Sphere>
            </group>
        </Float>
    )
}
