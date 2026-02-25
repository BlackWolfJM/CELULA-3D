import { useRef, useMemo, useLayoutEffect } from 'react'
import * as THREE from 'three'

interface RibosomesProps {
    count: number
    area: [number, number, number]
}

export const Ribosomes = ({ count, area }: RibosomesProps) => {
    const meshRef = useRef<THREE.InstancedMesh>(null)

    const dummy = useMemo(() => new THREE.Object3D(), [])

    useLayoutEffect(() => {
        if (meshRef.current) {
            for (let i = 0; i < count; i++) {
                const x = (Math.random() - 0.5) * area[0]
                const y = (Math.random() - 0.5) * area[1]
                const z = (Math.random() - 0.5) * area[2]

                dummy.position.set(x, y, z)
                dummy.updateMatrix()
                meshRef.current.setMatrixAt(i, dummy.matrix)
            }
            meshRef.current.instanceMatrix.needsUpdate = true
        }
    }, [count, area, dummy])

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshStandardMaterial color="#7A7A7A" />
        </instancedMesh>
    )
}
