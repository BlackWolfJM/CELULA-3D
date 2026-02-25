import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Float, Sphere } from '@react-three/drei'
import { useStore } from '../../store/useStore'

const IndividualLysosome = ({ position }: { position: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={1} position={position}>
            <Sphere
                ref={meshRef}
                args={[0.2, 16, 16]}
                onPointerDown={(e) => {
                    e.stopPropagation()
                    const worldPos = new THREE.Vector3()
                    meshRef.current?.getWorldPosition(worldPos)
                    setSelectedOrganelle('Lysosome', worldPos)
                }}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoveredOrganelle('Lysosome')
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHoveredOrganelle(null)
                    document.body.style.cursor = 'auto'
                }}
            >
                <meshStandardMaterial color="#8B0000" roughness={0.2} metalness={0.5} />
            </Sphere>
        </Float>
    )
}

const IndividualPeroxisome = ({ position }: { position: [number, number, number] }) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5} position={position}>
            <Sphere
                ref={meshRef}
                args={[0.15, 16, 16]}
                onPointerDown={(e) => {
                    e.stopPropagation()
                    const worldPos = new THREE.Vector3()
                    meshRef.current?.getWorldPosition(worldPos)
                    setSelectedOrganelle('Peroxisome', worldPos)
                }}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoveredOrganelle('Peroxisome')
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHoveredOrganelle(null)
                    document.body.style.cursor = 'auto'
                }}
            >
                <meshStandardMaterial color="#6B8E23" roughness={0.5} />
            </Sphere>
        </Float>
    )
}

export const Lysosomes = ({ count = 5, area = 4 }) => {
    const positions = useMemo(() =>
        Array.from({ length: count }).map(() =>
            [(Math.random() - 0.5) * area, (Math.random() - 0.5) * area, (Math.random() - 0.5) * area] as [number, number, number]
        ), [count, area])

    return (
        <group>
            {positions.map((pos, i) => (
                <IndividualLysosome key={i} position={pos} />
            ))}
        </group>
    )
}

export const Peroxisomes = ({ count = 3, area = 4 }) => {
    const positions = useMemo(() =>
        Array.from({ length: count }).map(() =>
            [(Math.random() - 0.5) * area, (Math.random() - 0.5) * area, (Math.random() - 0.5) * area] as [number, number, number]
        ), [count, area])

    return (
        <group>
            {positions.map((pos, i) => (
                <IndividualPeroxisome key={i} position={pos} />
            ))}
        </group>
    )
}
