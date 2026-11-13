import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { Suspense } from 'react'
import * as THREE from 'three'
import { Scene } from './cell/Scene'
import { useStore } from '../store/useStore'

const PostEffects = () => {
  const mode = useStore(s => s.mode)
  const quality = useStore(s => s.quality)
  if (quality === 'low') return null
  return (
    <EffectComposer enableNormalPass={false} multisampling={quality === 'high' ? 4 : 0}>
      <Bloom intensity={mode === 'fluorescence' ? 1.1 : 0.16}
        luminanceThreshold={mode === 'fluorescence' ? 0.7 : 1.4}
        luminanceSmoothing={0.2} mipmapBlur/>
      <Vignette eskil={false} offset={0.15} darkness={mode === 'microscope' ? 0.55 : 0.18} />
      {mode === 'microscope' ? <ChromaticAberration offset={new THREE.Vector2(0.0004,0.0004)}/> : <></>}
    </EffectComposer>
  )
}

export const Experience = () => {
  const mode = useStore(s => s.mode)
  const quality = useStore(s => s.quality)
  const dpr: [number,number] = quality === 'low' ? [1,1] : quality==='medium' ? [1,1.35] : [1,1.8]
  return (
    <Canvas className={'cell-canvas mode-'+mode}
      shadows={quality==='high'}
      dpr={dpr}
      gl={{ antialias: quality==='low', preserveDrawingBuffer: true, powerPreference:'high-performance' }}
      camera={{ position: [0,0,12.5], fov: 45 }}
      onCreated={({gl}) => { gl.localClippingEnabled = true }}
      fallback={<div className="webgl-fallback">Este navegador no admite WebGL. Prueba un navegador actualizado.</div>}
    >
      <color attach="background" args={[mode === 'microscope' ? '#e8eef2' : '#08111d']} />
      <Suspense fallback={null}><Scene /></Suspense>
      <PostEffects />
    </Canvas>
  )
}
