import { useFrame } from '@react-three/fiber'
import { easing } from 'maath'
import { useStore } from '../../store/useStore'
import * as THREE from 'three'
import { useRef, useEffect } from 'react'

export const CameraController = () => {
    const { cameraTarget, selectedOrganelle, internalView } = useStore()
    const lastSelected = useRef<string | null>(null)
    const animationStartTime = useRef<number>(0)
    const IS_ANIMATING_DURATION = 1.5 // seconds

    // Reset animation when selection changes
    useEffect(() => {
        if (selectedOrganelle !== lastSelected.current) {
            animationStartTime.current = performance.now() / 1000
            lastSelected.current = selectedOrganelle
        }
    }, [selectedOrganelle])

    useFrame((state, delta) => {
        const time = state.clock.getElapsedTime()
        const isAnimating = (time - animationStartTime.current) < IS_ANIMATING_DURATION

        if (selectedOrganelle && cameraTarget) {
            // Soft damp the target to allow some manual movement while keeping it centered
            easing.damp3(state.controls ? (state.controls as any).target : new THREE.Vector3(), cameraTarget, 0.3, delta)

            if (isAnimating) {
                const offset = new THREE.Vector3(0, 0, 3)
                const targetPos = cameraTarget.clone().add(offset)
                // Smooth transition to organelle
                easing.damp3(state.camera.position, targetPos, 0.35, delta)
            }
        } else if (!selectedOrganelle && isAnimating) {
            // Return to default view ONLY during transition back
            const defaultPos = internalView ? new THREE.Vector3(0, 0, 5) : new THREE.Vector3(0, 0, 10)
            const defaultTarget = new THREE.Vector3(0, 0, 0)

            easing.damp3(state.camera.position, defaultPos, 0.4, delta)
            easing.damp3(state.controls ? (state.controls as any).target : new THREE.Vector3(), defaultTarget, 0.3, delta)
        }
    })

    return null
}
