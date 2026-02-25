import { create } from 'zustand'
import * as THREE from 'three'

interface CellState {
  selectedOrganelle: string | null
  hoveredOrganelle: string | null
  mode: 'default' | 'microscope' | 'fluorescence' | 'dark'
  internalView: boolean
  cameraTarget: THREE.Vector3 | null
  interactiveMode: boolean
  setSelectedOrganelle: (name: string | null, target?: THREE.Vector3) => void
  setHoveredOrganelle: (name: string | null) => void
  setMode: (mode: 'default' | 'microscope' | 'fluorescence' | 'dark') => void
  setInternalView: (view: boolean) => void
  setInteractiveMode: (v: boolean) => void
}

export const useStore = create<CellState>((set) => ({
  selectedOrganelle: null,
  hoveredOrganelle: null,
  mode: 'dark',
  internalView: false,
  cameraTarget: null,
  interactiveMode: true,
  setSelectedOrganelle: (name, target) => set((state) => {
    // In exploration mode, ignore any selection (but always allow deselect)
    if (!state.interactiveMode && name !== null) return {}
    return {
      selectedOrganelle: name,
      cameraTarget: target || null
    }
  }),
  setHoveredOrganelle: (name) => set({ hoveredOrganelle: name }),
  setMode: (mode) => set({ mode }),
  setInternalView: (view) => set({ internalView: view }),
  setInteractiveMode: (v) => set({ interactiveMode: v }),
}))
