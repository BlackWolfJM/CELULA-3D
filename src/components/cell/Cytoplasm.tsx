import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Points, PointMaterial, Point } from '@react-three/drei'

export const Cytoplasm = () => {
    const pointsRef = useRef<THREE.Points>(null)

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < 200; i++) {
            temp.push({
                position: [
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8,
                    (Math.random() - 0.5) * 8
                ] as [number, number, number],
                phase: Math.random() * Math.PI * 2,
                speed: Math.random() * 0.2 + 0.1
            })
        }
        return temp
    }, [])

    useFrame((state) => {
        if (pointsRef.current) {
            const time = state.clock.getElapsedTime()
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]
                const i3 = i * 3
                positions[i3] = p.position[0] + Math.sin(time * p.speed + p.phase) * 0.1
                positions[i3 + 1] = p.position[1] + Math.cos(time * p.speed + p.phase) * 0.1
                positions[i3 + 2] = p.position[2] + Math.sin(time * p.speed * 0.5 + p.phase) * 0.1
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true
        }
    })

    return (
        <group>
            <Points ref={pointsRef} limit={200}>
                <PointMaterial
                    transparent
                    vertexColors
                    size={0.03}
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={0.3}
                    color="#CFEFFF"
                />
                {particles.map((p, i) => (
                    <Point key={i} position={[0, 0, 0]} /> // Position is set via attributes in useFrame
                ))}
            </Points>
        </group>
    )
}
