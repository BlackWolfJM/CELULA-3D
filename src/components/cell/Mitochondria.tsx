import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Float, Points, Point, PointMaterial } from '@react-three/drei'
import { useStore } from '../../store/useStore'

export const Mitochondria = ({ position = [0, 0, 0] as [number, number, number], rotation = [0, 0, 0] as [number, number, number] }) => {
    const pointsRef = useRef<THREE.Points>(null)
    const groupRef = useRef<THREE.Group>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    const particles = useMemo(() => {
        const temp = []
        for (let i = 0; i < 50; i++) {
            temp.push({
                position: [Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5],
                speed: Math.random() * 0.01 + 0.005
            })
        }
        return temp
    }, [])

    useFrame(() => {
        if (pointsRef.current) {
            pointsRef.current.rotation.y += 0.01
            const positions = pointsRef.current.geometry.attributes.position.array as Float32Array
            for (let i = 0; i < positions.length; i += 3) {
                positions[i + 1] += 0.01
                if (positions[i + 1] > 1) positions[i + 1] = -1
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true
        }
    })

    return (
        <Float speed={3} rotationIntensity={1} floatIntensity={1} position={position} rotation={rotation}>
            <group ref={groupRef}>
                <mesh
                    onPointerDown={(e) => {
                        e.stopPropagation()
                        // Get world position for camera target
                        const worldPos = new THREE.Vector3()
                        groupRef.current?.getWorldPosition(worldPos)
                        setSelectedOrganelle('Mitochondria', worldPos)
                    }}
                    onPointerOver={(e) => {
                        e.stopPropagation()
                        setHoveredOrganelle('Mitochondria')
                        document.body.style.cursor = 'pointer'
                    }}
                    onPointerOut={() => {
                        setHoveredOrganelle(null)
                        document.body.style.cursor = 'auto'
                    }}
                >
                    <capsuleGeometry args={[0.4, 1, 4, 16]} />
                    <meshStandardMaterial color="#FF6B35" transparent opacity={0.6} />
                </mesh>

                <mesh scale={[0.8, 0.9, 0.8]}>
                    <capsuleGeometry args={[0.3, 0.8, 10, 16]} />
                    <meshStandardMaterial color="#FFA07A" wireframe />
                </mesh>

                <Points ref={pointsRef} limit={50}>
                    <PointMaterial
                        transparent
                        vertexColors
                        size={0.05}
                        sizeAttenuation={true}
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        color="#FFD700"
                    />
                    {particles.map((p, i) => (
                        <Point key={i} position={p.position as [number, number, number]} />
                    ))}
                </Points>
            </group>
        </Float>
    )
}
