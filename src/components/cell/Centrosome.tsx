import { useRef } from 'react'
import * as THREE from 'three'
import { Float, Box } from '@react-three/drei'
import { useStore } from '../../store/useStore'

const Centriole = ({ rotation = [0, 0, 0] as [number, number, number] }) => (
    <group rotation={rotation}>
        {Array.from({ length: 9 }).map((_, i) => (
            <Box key={i} args={[0.05, 0.6, 0.05]} position={[Math.cos(i * (Math.PI * 2 / 9)) * 0.15, 0, Math.sin(i * (Math.PI * 2 / 9)) * 0.15]}>
                <meshStandardMaterial color="#A9A9A9" />
            </Box>
        ))}
    </group>
)

export const Centrosome = ({ position = [0, 0, 0] as [number, number, number] }) => {
    const groupRef = useRef<THREE.Group>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
            <group
                ref={groupRef}
                onPointerDown={(e) => {
                    e.stopPropagation()
                    const worldPos = new THREE.Vector3()
                    groupRef.current?.getWorldPosition(worldPos)
                    setSelectedOrganelle('Centrosome', worldPos)
                }}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoveredOrganelle('Centrosome')
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHoveredOrganelle(null)
                    document.body.style.cursor = 'auto'
                }}
            >
                <Centriole />
                <Centriole rotation={[Math.PI / 2, 0, 0]} />

                {/* Pericentriolar material (subtle cloud) */}
                <mesh scale={[0.8, 0.8, 0.8]}>
                    <sphereGeometry args={[0.5, 16, 16]} />
                    <meshStandardMaterial color="#A9A9A9" transparent opacity={0.1} />
                </mesh>
            </group>
        </Float>
    )
}
