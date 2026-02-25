import { useRef, useMemo } from 'react'
import * as THREE from 'three'
import { Float, Sphere } from '@react-three/drei'
import { useStore } from '../../store/useStore'

const IndividualVesicle = ({ position, type }: { position: [number, number, number], type: 'vesicle' | 'vacuole' | 'lipid' | 'glycogen' }) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    const config = {
        vesicle: { size: 0.12, color: '#FFF176', label: 'Vesicle' },
        vacuole: { size: 0.3, color: '#E0F7FA', label: 'Vacuola Pequeña' },
        lipid: { size: 0.25, color: '#FFEB3B', label: 'Inclusión Lipídica' },
        glycogen: { size: 0.08, color: '#F5DEB3', label: 'Gránulo de Glucógeno' }
    }[type]

    return (
        <Float speed={1.5} rotationIntensity={0.5} floatIntensity={1} position={position}>
            <Sphere
                ref={meshRef}
                args={[config.size, 16, 16]}
                onPointerDown={(e) => {
                    e.stopPropagation()
                    const worldPos = new THREE.Vector3()
                    meshRef.current?.getWorldPosition(worldPos)
                    setSelectedOrganelle(config.label, worldPos)
                }}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoveredOrganelle(config.label)
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHoveredOrganelle(null)
                    document.body.style.cursor = 'auto'
                }}
            >
                <meshStandardMaterial
                    color={config.color}
                    roughness={type === 'lipid' ? 0.1 : 0.5}
                    metalness={type === 'lipid' ? 0.4 : 0.1}
                    transparent={type === 'vacuole'}
                    opacity={type === 'vacuole' ? 0.6 : 1}
                />
            </Sphere>
        </Float>
    )
}

export const VesiclesAndInclusions = () => {
    const items = useMemo(() => {
        const temp = []
        const types: ('vesicle' | 'vacuole' | 'lipid' | 'glycogen')[] = ['vesicle', 'vacuole', 'lipid', 'glycogen']

        types.forEach(type => {
            const count = type === 'glycogen' ? 10 : type === 'vesicle' ? 8 : 3
            for (let i = 0; i < count; i++) {
                temp.push({
                    id: `${type}-${i}`,
                    type,
                    position: [
                        (Math.random() - 0.5) * 7,
                        (Math.random() - 0.5) * 7,
                        (Math.random() - 0.5) * 7
                    ] as [number, number, number]
                })
            }
        })
        return temp
    }, [])

    return (
        <group>
            {items.map(item => (
                <IndividualVesicle key={item.id} position={item.position} type={item.type} />
            ))}
        </group>
    )
}
