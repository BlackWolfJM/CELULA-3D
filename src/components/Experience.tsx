import { Canvas } from '@react-three/fiber'
import { Scene } from './cell/Scene'
import { EffectComposer, Bloom, DepthOfField, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { Suspense } from 'react'
import { useStore } from '../store/useStore'
import * as THREE from 'three'

export const Experience = () => {
    const mode = useStore((state) => state.mode)

    return (
        <Canvas
            shadows
            camera={{ position: [0, 0, 10], fov: 45 }}
            gl={{ antialias: false }}
        >
            <color attach="background" args={[mode === 'dark' ? '#0B0F1A' : '#F5F7FA']} />

            <Suspense fallback={null}>
                <Scene />
            </Suspense>

            <EffectComposer disableNormalPass>
                <Bloom
                    intensity={mode === 'fluorescence' ? 1.5 : 0.5}
                    luminanceThreshold={1.0}
                    luminanceSmoothing={0.1}
                    mipmapBlur
                />
                <DepthOfField
                    focusDistance={0.01}
                    focalLength={0.2}
                    bokehScale={3}
                />
                {mode === 'microscope' ? (
                    <>
                        <ChromaticAberration offset={new THREE.Vector2(0.001, 0.001)} />
                        <Vignette eskil={false} offset={0.1} darkness={0.8} />
                    </>
                ) : <></>}
            </EffectComposer>
        </Canvas>
    )
}
