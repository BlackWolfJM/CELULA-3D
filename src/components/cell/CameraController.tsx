import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import * as THREE from 'three'
import { useStore } from '../../store/useStore'

export const CameraController = () => {
  const { selectedOrganelle, cameraTarget, internalView, cameraRequest } = useStore()
  const lastSelection = useRef<string | null>(null)
  const lastTarget = useRef<THREE.Vector3 | null>(null)
  const lastInside = useRef<boolean>(false)
  const lastCommand = useRef<number>(0)
  const cameraGoal = useRef(new THREE.Vector3(0,0,10))
  const orbitGoal = useRef(new THREE.Vector3())
  const moving = useRef(false)

  useFrame((state, delta) => {
    const controls = state.controls
    if (!controls || !('target' in controls)) return
    const orbitTarget = controls.target as THREE.Vector3
    if (selectedOrganelle !== lastSelection.current || cameraTarget !== lastTarget.current || internalView !== lastInside.current) {
      lastSelection.current = selectedOrganelle
      lastTarget.current = cameraTarget
      lastInside.current = internalView
      orbitGoal.current.copy(selectedOrganelle && cameraTarget ? cameraTarget : new THREE.Vector3())
      const next = selectedOrganelle && cameraTarget
        ? cameraTarget.clone().add(new THREE.Vector3(0,0,3.7))
        : internalView ? new THREE.Vector3(0.6, 0.2, 0.8) : new THREE.Vector3(0,0,12.5)
      cameraGoal.current.copy(next)
      moving.current = true
    }

    if (cameraRequest.nonce !== lastCommand.current) {
      lastCommand.current = cameraRequest.nonce
      const cmd = cameraRequest.action
      const target = selectedOrganelle && cameraTarget ? cameraTarget : orbitTarget
      if (cmd === 'home') {
        orbitGoal.current.set(0,0,0)
        cameraGoal.current.set(0,0,12.5)
      } else if (cmd === 'front') {
        orbitGoal.current.copy(target); cameraGoal.current.copy(target).add(new THREE.Vector3(0,0,11))
      } else if (cmd === 'top') {
        orbitGoal.current.copy(target); cameraGoal.current.copy(target).add(new THREE.Vector3(0,11,0.1))
      } else if (cmd === 'left') {
        orbitGoal.current.copy(target); cameraGoal.current.copy(target).add(new THREE.Vector3(-11,0,0.1))
      } else {
        const vector = state.camera.position.clone().sub(orbitTarget)
        const ratio = cmd === 'zoomIn' ? 0.7 : 1.35
        vector.multiplyScalar(ratio).clampLength(0.45,24)
        orbitGoal.current.copy(orbitTarget)
        cameraGoal.current.copy(orbitTarget).add(vector)
      }
      moving.current = true
    }

    if (moving.current) {
      easing.damp3(state.camera.position, cameraGoal.current, 0.45, delta)
      easing.damp3(orbitTarget, orbitGoal.current, 0.42, delta)
      if (state.camera.position.distanceTo(cameraGoal.current) < 0.035 &&
        orbitTarget.distanceTo(orbitGoal.current) < 0.035) {
        moving.current = false
      }
      if ('update' in controls && typeof controls.update === 'function') controls.update()
    }
  })
  return null
}
