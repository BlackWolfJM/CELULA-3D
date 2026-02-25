import { useStore } from '../../store/useStore'

export const Lights = () => {
    const mode = useStore((state) => state.mode)

    return (
        <>
            <ambientLight intensity={mode === 'dark' ? 0.2 : 0.5} />
            <directionalLight
                position={[5, 5, 5]}
                intensity={1.5}
                castShadow
            />
            <pointLight
                position={[-5, -5, -5]}
                color="#00BFFF"
                intensity={0.8}
            />
            <pointLight
                position={[2, 2, -2]}
                color="#8A2BE2"
                intensity={0.5}
            />

            {mode === 'fluorescence' && (
                <group>
                    <pointLight position={[0, 0, 0]} color="#00FFD1" intensity={2} distance={10} />
                </group>
            )}
        </>
    )
}
