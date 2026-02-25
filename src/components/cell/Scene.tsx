import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import { Suspense, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { Lights } from './Lights'
import { Membrane } from './Membrane'
import { Nucleus } from './Nucleus'
import { Mitochondria } from './Mitochondria'
import { Reticulum } from './Reticulum'
import { Golgi } from './Golgi'
import { Cytoplasm } from './Cytoplasm'
import { Lysosomes, Peroxisomes } from './Lysosomes'
import { Cytoskeleton } from './Cytoskeleton'
import { Centrosome } from './Centrosome'
import { VesiclesAndInclusions } from './Vesicles'
import { CameraController } from './CameraController'
import * as THREE from 'three'

export const Scene = () => {
    const internalView = useStore((state) => state.internalView)
    const selectedOrganelle = useStore((state) => state.selectedOrganelle)

    // Empty raycast handler to ensure the dimming mesh doesn't block interactions
    const noRaycast = useMemo(() => {
        return () => null
    }, [])

    return (
        <>
            <PerspectiveCamera
                makeDefault
                position={[0, 0, 10]}
                fov={internalView ? 75 : 45}
            />
            <OrbitControls
                enablePan={true}
                enableZoom={true}
                minDistance={1}
                maxDistance={25}
                makeDefault
                enableDamping={true}
                dampingFactor={0.08}
                rotateSpeed={1.8}
                panSpeed={1.5}
            />

            <CameraController />
            <Lights />

            <Suspense fallback={null}>
                <group>
                    {/* Dimming overlay when something is selected */}
                    {selectedOrganelle && (
                        <mesh scale={[20, 20, 20]} raycast={noRaycast}>
                            <sphereGeometry args={[1, 32, 32]} />
                            <meshBasicMaterial color="black" transparent opacity={0.7} side={THREE.BackSide} depthWrite={false} />
                        </mesh>
                    )}

                    <Membrane />
                    <Cytoplasm />
                    <Cytoskeleton />
                    <Nucleus />

                    <Mitochondria position={[2, 1, 2]} rotation={[0.5, 0.2, 0]} />
                    <Mitochondria position={[-2, -1.5, 1]} rotation={[-0.3, 0.8, 0.5]} />
                    <Mitochondria position={[0.5, 2, -1.5]} rotation={[1.1, 0, 0.2]} />

                    <Golgi position={[-2, 1, -1]} rotation={[0, 1, 0.5]} />

                    <Reticulum type="rugoso" position={[1.5, -0.5, -1.5]} rotation={[0, 0.5, 0.2]} />
                    <Reticulum type="liso" position={[-1, 2, 1]} rotation={[0.5, -0.2, 0]} />

                    <Centrosome position={[0, -1.8, 0.5]} />

                    <Lysosomes count={6} area={4} />
                    <Peroxisomes count={4} area={4} />
                    <VesiclesAndInclusions />
                </group>
                <Environment preset="city" />
            </Suspense>
        </>
    )
}
