import { create } from 'zustand'
import * as THREE from 'three'

interface CellState {
  selectedOrganelle: string | null
  hoveredOrganelle: string | null
  mode: 'default' | 'microscope' | 'fluorescence' | 'dark'
  internalView: boolean
  cameraTarget: THREE.Vector3 | null
  setSelectedOrganelle: (name: string | null, target?: THREE.Vector3) => void
  setHoveredOrganelle: (name: string | null) => void
  setMode: (mode: 'default' | 'microscope' | 'fluorescence' | 'dark') => void
  setInternalView: (view: boolean) => void
}

export const useStore = create<CellState>((set) => ({
  selectedOrganelle: null,
  hoveredOrganelle: null,
  mode: 'dark',
  internalView: false,
  cameraTarget: null,
  setSelectedOrganelle: (name, target) => set({
    selectedOrganelle: name,
    cameraTarget: target || null
  }),
  setHoveredOrganelle: (name) => set({ hoveredOrganelle: name }),
  setMode: (mode) => set({ mode }),
  setInternalView: (view) => set({ internalView: view }),
}))
