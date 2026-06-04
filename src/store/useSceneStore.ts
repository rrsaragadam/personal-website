import { create } from 'zustand'

export type SceneObject = 'laptop' | 'monitor' | 'ipad' | 'books' | null

interface SceneStore {
  isDayMode: boolean
  activeObject: SceneObject
  isTransitioning: boolean
  toggleDayMode: () => void
  setActiveObject: (obj: SceneObject) => void
  setTransitioning: (v: boolean) => void
}

export const useSceneStore = create<SceneStore>((set) => ({
  isDayMode: true,
  activeObject: null,
  isTransitioning: false,
  toggleDayMode: () => set((s) => ({ isDayMode: !s.isDayMode })),
  setActiveObject: (obj) => set({ activeObject: obj }),
  setTransitioning: (v) => set({ isTransitioning: v }),
}))
