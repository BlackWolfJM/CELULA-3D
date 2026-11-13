import { create } from 'zustand'
import * as THREE from 'three'

export type ViewMode = 'dark' | 'microscope' | 'fluorescence'
export type CellType = 'animal' | 'plant' | 'neuron' | 'hepatocyte' | 'muscle'
export type ProcessType = 'none' | 'protein' | 'atp' | 'endocytosis'
export type Quality = 'low' | 'medium' | 'high'
export type CutAxis = 'x' | 'y' | 'z'
export type CameraAction = 'home' | 'zoomIn' | 'zoomOut' | 'front' | 'top' | 'left'

interface CellState {
  selectedOrganelle: string | null
  hoveredOrganelle: string | null
  cameraTarget: THREE.Vector3 | null
  mode: ViewMode
  cellType: CellType
  internalView: boolean
  condition: 'healthy' | 'stress'
  simulation: ProcessType
  simulationPlaying: boolean
  quality: Quality
  visibleOrganelles: Record<string, boolean>
  labelsVisible: boolean
  fluorescenceChannels: { nucleus: boolean; mitochondria: boolean; membrane: boolean }
  cutEnabled: boolean
  cutAxis: CutAxis
  cutDepth: number
  cameraRequest: { action: CameraAction; nonce: number }
  setSelectedOrganelle: (id: string | null, target?: THREE.Vector3) => void
  setHoveredOrganelle: (id: string | null) => void
  setMode: (mode: ViewMode) => void
  setCellType: (cellType: CellType) => void
  setInternalView: (internalView: boolean) => void
  setCondition: (condition: 'healthy' | 'stress') => void
  setSimulation: (simulation: ProcessType) => void
  setSimulationPlaying: (playing: boolean) => void
  setQuality: (quality: Quality) => void
  setOrganelleVisible: (id: string, visible: boolean) => void
  setAllVisible: (visible: boolean) => void
  setLabelsVisible: (visible: boolean) => void
  setFluorescenceChannel: (channel: 'nucleus' | 'mitochondria' | 'membrane', visible: boolean) => void
  setCutEnabled: (enabled: boolean) => void
  setCutAxis: (axis: CutAxis) => void
  setCutDepth: (depth: number) => void
  requestCamera: (action: CameraAction) => void
}

export const useStore = create<CellState>((set) => ({
  selectedOrganelle: null,
  hoveredOrganelle: null,
  cameraTarget: null,
  mode: 'dark',
  cellType: 'animal',
  internalView: false,
  condition: 'healthy',
  simulation: 'none',
  simulationPlaying: true,
  quality: 'high',
  visibleOrganelles: {},
  labelsVisible: true,
  fluorescenceChannels: { nucleus: true, mitochondria: true, membrane: true },
  cutEnabled: false,
  cutAxis: 'z',
  cutDepth: 0,
  cameraRequest: { action: 'home', nonce: 0 },
  setSelectedOrganelle: (id, target) => set({ selectedOrganelle: id, cameraTarget: id ? (target ?? null) : null }),
  setHoveredOrganelle: (id) => set({ hoveredOrganelle: id }),
  setMode: (mode) => set({ mode }),
  setCellType: (cellType) => set({ cellType, selectedOrganelle: null, cameraTarget: null, internalView: false, cutEnabled: false }),
  setInternalView: (internalView) => set({ internalView, selectedOrganelle: null, cameraTarget: null }),
  setCondition: (condition) => set({ condition }),
  setSimulation: (simulation) => set({ simulation, simulationPlaying: true }),
  setSimulationPlaying: (simulationPlaying) => set({ simulationPlaying }),
  setQuality: (quality) => set({ quality }),
  setOrganelleVisible: (id, visible) => set(state => ({ visibleOrganelles: { ...state.visibleOrganelles, [id]: visible } })),
  setAllVisible: (visible) => set({ visibleOrganelles: Object.fromEntries(['Membrane', 'Nucleus', 'Mitochondria', 'Rough ER', 'Smooth ER', 'Golgi', 'Lysosome', 'Peroxisome', 'Cytoskeleton', 'Cytoplasm', 'Centrosome', 'Vesicle', 'Chloroplast', 'Cell Wall', 'Central Vacuole', 'Axon', 'Myofibril'].map(id => [id, visible])) }),
  setLabelsVisible: (labelsVisible) => set({ labelsVisible }),
  setFluorescenceChannel: (channel, visible) => set(state => ({ fluorescenceChannels: { ...state.fluorescenceChannels, [channel]: visible } })),
  setCutEnabled: (cutEnabled) => set({ cutEnabled }),
  setCutAxis: (cutAxis) => set({ cutAxis }),
  setCutDepth: (cutDepth) => set({ cutDepth: Math.max(-4.5, Math.min(4.5, cutDepth)) }),
  requestCamera: (action) => set(state => ({ cameraRequest: { action, nonce: state.cameraRequest.nonce + 1 } })),
}))
