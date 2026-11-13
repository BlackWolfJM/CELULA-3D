import { useMemo, useRef } from 'react'
import type { ReactNode } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { useStore } from '../../store/useStore'

type HitProps = { id: string; children: ReactNode; position?: [number, number, number] }
const Selectable = ({ id, children, position = [0, 0, 0] }: HitProps) => {
  const ref = useRef<THREE.Group>(null)
  const select = useStore(s => s.setSelectedOrganelle)
  const hover = useStore(s => s.setHoveredOrganelle)
  return (
    <group ref={ref} position={position}
      onPointerDown={e => { e.stopPropagation(); const p = new THREE.Vector3(); ref.current?.getWorldPosition(p); select(id, p) }}
      onPointerOver={e => { e.stopPropagation(); hover(id); document.body.style.cursor = 'pointer' }}
      onPointerOut={() => { hover(null); document.body.style.cursor = 'auto' }}>
      {children}
    </group>
  )
}

const chloroplastPositions: [number, number, number][] = [
  [-3.1, 2.3, 1.1], [-2.7, -2.4, 0.8], [2.8, 2.3, 1.1],
  [2.8, -2.5, 0.9], [-3.3, 0.2, -1], [3.1, 0.5, -1.7]
]

const NeuronExtensions = () => {
  const paths = useMemo(() => [
    [[3.7, 0.1, 0], [5, 0.2, 0], [6.8, -0.1, 0], [9, 0.3, 0]],
    [[-3, 2, 0], [-4.6, 3.3, 0], [-6.3, 3.4, 0]],
    [[-3.2, -1.2, 0], [-5, -2.5, 0.5], [-6.6, -3.1, 0.5]],
    [[-2, 3.3, 0], [-2.8, 5.1, 0.4], [-3.4, 6.1, 0.4]]
  ].map(points => new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])))), [])
  return <Selectable id="Axon">
    {paths.map((path, i) => <mesh key={i}>
      <tubeGeometry args={[path, 38, i === 0 ? 0.17 : 0.09, 9, false]} />
      <meshStandardMaterial color={i === 0 ? '#c69be7' : '#9bb5ed'} roughness={0.55} />
    </mesh>)}
    <mesh position={[9, 0.3, 0]}><sphereGeometry args={[0.28, 16, 12]} /><meshStandardMaterial color="#d8b2ed" /></mesh>
  </Selectable>
}

export const CellExtras = () => {
  const type = useStore(s => s.cellType)
  const condition = useStore(s => s.condition)
  const visible = useStore(s => s.visibleOrganelles)
  const show = (id: string) => visible[id] !== false

  return (
    <group>
      {type === 'plant' && <>
        {show('Cell Wall') && <Selectable id="Cell Wall">
          <mesh>
            <boxGeometry args={[10.2, 9.4, 8.5]} />
            <meshPhysicalMaterial color="#71b585" transparent opacity={0.16} roughness={0.8} side={THREE.DoubleSide} depthWrite={false} />
          </mesh>
          <lineSegments>
            <edgesGeometry args={[new THREE.BoxGeometry(10.2, 9.4, 8.5)]} />
            <lineBasicMaterial color="#b8efb0" transparent opacity={0.85} />
          </lineSegments>
        </Selectable>}
        {show('Central Vacuole') && <Selectable id="Central Vacuole" position={[1.6, 0.2, -1]}>
          <mesh scale={[1.05, 1.7, 1.2]}><sphereGeometry args={[1, 32, 24]}/><meshPhysicalMaterial color="#77badc" transparent opacity={0.2} depthWrite={false} /></mesh>
        </Selectable>}
        {show('Chloroplast') && chloroplastPositions.map((p, i) =>
          <Selectable id="Chloroplast" position={p} key={i}>
            <mesh rotation={[0.3, i * 0.5, 0.2]} scale={[0.75, 0.4, 0.35]}>
              <sphereGeometry args={[1, 24, 16]}/>
              <meshStandardMaterial color="#4ea46d" emissive="#167b38" emissiveIntensity={0.2} />
            </mesh>
            {[-0.28, 0, 0.28].map((offset, j)=>
              <mesh position={[offset, 0, 0]} key={j} rotation={[0, Math.PI/2, 0]}>
                <cylinderGeometry args={[0.22, 0.22, 0.06, 16]}/>
                <meshStandardMaterial color="#a5df6d" />
              </mesh>
            )}
          </Selectable>
        )}
      </>}
      {type === 'neuron' && show('Axon') && <NeuronExtensions />}
      {type === 'muscle' && show('Myofibril') && <Selectable id="Myofibril">
        {[-1.5, -0.7, 0.2, 1.1].map((y, i) =>
          <group key={i} position={[0, y, 0.8]}>
            <mesh rotation={[0, 0, Math.PI/2]}>
              <cylinderGeometry args={[0.15, 0.15, 7.2, 10]}/>
              <meshStandardMaterial color="#c17d9a" roughness={0.65}/>
            </mesh>
            {Array.from({length:11},(_,j)=>
              <mesh key={j} position={[-3.3+j*0.65,0,0]}>
                <boxGeometry args={[0.05,0.36,0.36]}/>
                <meshStandardMaterial color="#efc7d1"/>
              </mesh>
            )}
          </group>
        )}
      </Selectable>}
      {type === 'hepatocyte' &&
        <group>
          <mesh position={[0,-3.7,0]} rotation={[0.3,0,0]}>
            <torusGeometry args={[1.65, 0.11, 8, 64]}/>
            <meshStandardMaterial color="#ccbb86" emissive="#786834" emissiveIntensity={0.25}/>
          </mesh>
        </group>}
      {condition === 'stress' && <group>
        <mesh position={[2, 1, 2]} scale={[1.15, 0.7, 0.7]}>
          <sphereGeometry args={[0.9, 24, 16]}/>
          <meshBasicMaterial color="#f57f6c" transparent opacity={0.11} depthWrite={false}/>
        </mesh>
      </group>}
    </group>
  )
}

type LabelEntry = { id: string; title: string; p: [number,number,number]; type?: string }
const baseLabels: LabelEntry[] = [
  {id:'Nucleus',title:'Núcleo',p:[0,1.8,0]},
  {id:'Mitochondria',title:'Mitocondria',p:[2.5,2.1,2]},
  {id:'Golgi',title:'Aparato de Golgi',p:[-2.3,2,-1]},
  {id:'Rough ER',title:'Retículo rugoso',p:[1.5,-1.7,-1.5]},
  {id:'Membrane',title:'Membrana',p:[4.8,1.2,0]},
  {id:'Centrosome',title:'Centrosoma',p:[0,-2.8,0.5]}
]
export const CellLabels = () => {
  const enabled = useStore(s => s.labelsVisible)
  const selected = useStore(s => s.selectedOrganelle)
  const cellType = useStore(s => s.cellType)
  const visible = useStore(s => s.visibleOrganelles)
  const internalView = useStore(s => s.internalView)
  const labels = [...baseLabels, ...(cellType==='plant'
    ? [{id:'Chloroplast',title:'Cloroplastos',p:[-3,2.7,1] as [number,number,number]}]
    : cellType==='neuron' ? [{id:'Axon',title:'Axón',p:[6.6,0.5,0] as [number,number,number]}]
    : cellType==='muscle' ? [{id:'Myofibril',title:'Miofibrillas',p:[1,-1.7,0.8] as [number,number,number]}]
    : [])]
  if (!enabled || internalView) return null
  return <group>
    {labels.filter(item => visible[item.id] !== false).map(label =>
      <Html key={label.id} position={label.p} center style={{pointerEvents:'none'}} zIndexRange={[15,5]}>
        <div className={'cell-label' + (selected===label.id ? ' cell-label--selected' : '')}>
          <span className="cell-label-dot" />{label.title}
        </div>
      </Html>
    )}
  </group>
}
