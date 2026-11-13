import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera, Environment } from '@react-three/drei'
import * as THREE from 'three'
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
import { CellExtras, CellLabels } from './CellExtras'
import { CellProcesses } from './CellProcesses'

const ClippingController = () => {
  const renderer = useThree(s => s.gl)
  const enabled = useStore(s => s.cutEnabled)
  const axis = useStore(s => s.cutAxis)
  const depth = useStore(s => s.cutDepth)
  useEffect(() => {
    const normal = axis === 'x' ? new THREE.Vector3(-1,0,0)
      : axis === 'y' ? new THREE.Vector3(0,-1,0)
      : new THREE.Vector3(0,0,-1)
    renderer.clippingPlanes = enabled ? [new THREE.Plane(normal, depth)] : []
    renderer.localClippingEnabled = true
    return () => { renderer.clippingPlanes = [] }
  }, [renderer, enabled, axis, depth])
  return null
}

export const Scene = () => {
  const inside = useStore(s => s.internalView)
  const mode = useStore(s => s.mode)
  const quality = useStore(s => s.quality)
  const visible = useStore(s => s.visibleOrganelles)
  const channels = useStore(s => s.fluorescenceChannels)
  const show = (id: string) => visible[id] !== false &&
    (mode !== 'fluorescence' ||
      (id === 'Nucleus' ? channels.nucleus :
       id === 'Mitochondria' ? channels.mitochondria :
       id === 'Membrane' ? channels.membrane : true))

  return <>
    <PerspectiveCamera makeDefault position={[0,0,12.5]} fov={inside ? 78 : 45} near={0.05} far={150}/>
    <OrbitControls makeDefault enablePan enableRotate enableZoom enableDamping dampingFactor={0.1}
      minDistance={inside ? 0.15 : 0.6} maxDistance={32} rotateSpeed={0.7} panSpeed={0.65}
      enableKeys />
    <CameraController />
    <ClippingController />
    <Lights />
    <group>
      {show('Membrane') && <Membrane />}
      {quality !== 'low' && show('Cytoplasm') && <Cytoplasm />}
      {quality !== 'low' && show('Cytoskeleton') && <Cytoskeleton />}
      {show('Nucleus') && <Nucleus />}
      {show('Mitochondria') && <>
        <Mitochondria position={[2,1,2]} rotation={[0.5,0.2,0]}/>
        <Mitochondria position={[-2,-1.5,1]} rotation={[-0.3,0.8,0.5]}/>
        <Mitochondria position={[0.5,2,-1.5]} rotation={[1.1,0,0.2]}/>
      </>}
      {show('Golgi') && <Golgi position={[-2,1,-1]} rotation={[0,1,0.5]}/>}
      {show('Rough ER') && <Reticulum type="rugoso" position={[1.5,-0.5,-1.5]} rotation={[0,0.5,0.2]}/>}
      {show('Smooth ER') && <Reticulum type="liso" position={[-1,2,1]} rotation={[0.5,-0.2,0]}/>}
      {show('Centrosome') && <Centrosome position={[0,-1.8,0.5]}/>}
      {show('Lysosome') && <Lysosomes count={quality==='low' ? 3 : 6} area={4}/>}
      {show('Peroxisome') && <Peroxisomes count={quality==='low' ? 2 : 4} area={4}/>}
      {show('Vesicle') && quality!=='low' && <VesiclesAndInclusions />}
      <CellExtras />
      <CellProcesses />
    </group>
    <CellLabels />
    {quality !== 'low' && <Environment preset="city" />}
  </>
}
