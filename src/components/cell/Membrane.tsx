import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { Sphere, MeshDistortMaterial } from '@react-three/drei'
import { useStore } from '../../store/useStore'

const vertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = vec3(modelViewMatrix * vec4(position, 1.0));
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform vec3 uColor;
uniform vec3 uGlowColor;
uniform float uPower;
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vec3 viewDirection = normalize(-vPosition);
  float fresnel = 1.0 - clamp(abs(dot(vNormal, viewDirection)), 0.0, 1.0);
  float intensity = pow(fresnel, uPower);
  vec3 color = mix(uColor, uGlowColor, intensity);
  gl_FragColor = vec4(color, 0.1 + intensity * 0.4);
}
`

export const Membrane = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    const { setSelectedOrganelle, setHoveredOrganelle } = useStore()

    const uniforms = useMemo(() => ({
        uColor: { value: new THREE.Color("#6EC1E4") },
        uGlowColor: { value: new THREE.Color("#00BFFF") },
        uPower: { value: 2.0 }
    }), [])

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
        }
    })

    const handleClick = (e: any) => {
        e.stopPropagation()
        // For membrane, we focus on the edge or a slightly offset position
        setSelectedOrganelle('Membrane', new THREE.Vector3(5, 0, 0))
    }

    return (
        <group>
            <Sphere
                ref={meshRef}
                args={[5, 64, 64]}
                onPointerDown={handleClick}
                onPointerOver={(e) => {
                    e.stopPropagation()
                    setHoveredOrganelle('Membrane')
                    document.body.style.cursor = 'pointer'
                }}
                onPointerOut={() => {
                    setHoveredOrganelle(null)
                    document.body.style.cursor = 'auto'
                }}
            >
                <shaderMaterial
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    uniforms={uniforms}
                    transparent={true}
                    side={THREE.DoubleSide}
                />
            </Sphere>
            <Sphere args={[4.9, 64, 64]}>
                <MeshDistortMaterial
                    color="#6EC1E4"
                    speed={1.5}
                    distort={0.05}
                    radius={1}
                    transparent
                    opacity={0.1}
                />
            </Sphere>
        </group>
    )
}
