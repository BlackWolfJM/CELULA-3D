import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { Line } from '@react-three/drei'
import { useStore } from '../../store/useStore'

export const Cytoskeleton = () => {
    const groupRef = useRef<THREE.Group>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    const microtubules = useMemo(() => {
        const lines = []
        for (let i = 0; i < 20; i++) {
            const start = new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            )
            const end = new THREE.Vector3(
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8,
                (Math.random() - 0.5) * 8
            )
            lines.push([start, end] as [THREE.Vector3, THREE.Vector3])
        }
        return lines
    }, [])

    return (
        <group
            ref={groupRef}
            onPointerDown={(e) => {
                e.stopPropagation()
                setSelectedOrganelle('Cytoskeleton', new THREE.Vector3(2, 2, 2))
            }}
            onPointerOver={(e) => {
                e.stopPropagation()
                setHoveredOrganelle('Cytoskeleton')
                document.body.style.cursor = 'pointer'
            }}
            onPointerOut={() => {
                setHoveredOrganelle(null)
                document.body.style.cursor = 'auto'
            }}
        >
            {microtubules.map((points, i) => (
                <Line
                    key={i}
                    points={points}
                    color="#0033A0"
                    lineWidth={1}
                    transparent
                    opacity={0.2}
                />
            ))}

            {Array.from({ length: 30 }).map((_, i) => (
                <Line
                    key={`actin-${i}`}
                    points={[
                        new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8),
                        new THREE.Vector3((Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8, (Math.random() - 0.5) * 8).addScalar(0.5)
                    ]}
                    color="#DC143C"
                    lineWidth={0.5}
                    transparent
                    opacity={0.2}
                />
            ))}
        </group>
    )
}
