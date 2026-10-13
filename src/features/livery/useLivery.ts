import { create } from 'zustand'
import { DEFAULT_LIVERY, LIVERIES, type Livery } from './liveries'

interface LiveryStore {
  livery: Livery
  setLivery: (id: string) => void
  next: () => void
}

export const useLivery = create<LiveryStore>((set, get) => ({
  livery: DEFAULT_LIVERY,
  setLivery: (id) => {
    const livery = LIVERIES.find((l) => l.id === id)
    if (livery) set({ livery })
  },
  next: () => {
    const i = LIVERIES.indexOf(get().livery)
    set({ livery: LIVERIES[(i + 1) % LIVERIES.length] })
  },
}))
