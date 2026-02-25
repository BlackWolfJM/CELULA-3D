import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sphere, Float } from '@react-three/drei'
import { useStore } from '../../store/useStore'

export const Nucleus = () => {
    const nucleolusRef = useRef<THREE.Mesh>(null)
    const groupRef = useRef<THREE.Group>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    useFrame((state) => {
        if (nucleolusRef.current) {
            const scale = 1 + Math.sin(state.clock.getElapsedTime() * 2) * 0.05
            nucleolusRef.current.scale.set(scale, scale, scale)
        }
    })

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <Sphere
                    args={[1.5, 32, 32]}
                    onPointerDown={(e) => {
                        e.stopPropagation()
                        setSelectedOrganelle('Nucleus', groupRef.current?.position.clone())
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation()
                        setHoveredOrganelle('Nucleus')
                        document.body.style.cursor = 'pointer'
                    }}
                    onPointerOut={() => {
                        setHoveredOrganelle(null)
                        document.body.style.cursor = 'auto'
                    }}
                >
                    <meshStandardMaterial
                        color="#6A5ACD"
                        transparent
                        opacity={0.8}
                        roughness={0.3}
                    />
                </Sphere>

                <Sphere ref={nucleolusRef} args={[0.5, 32, 32]}>
                    <meshStandardMaterial
                        color="#8A2BE2"
                        emissive="#8A2BE2"
                        emissiveIntensity={2}
                    />
                </Sphere>
            </Float>
        </group>
    )
}
