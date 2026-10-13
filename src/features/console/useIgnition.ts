import { create } from 'zustand'

// The "start" moment: the gauge sweeps, lights wake up in sequence. Bumping
// `startedAt` replays it (the glass key does this on tap).
interface IgnitionStore {
  startedAt: number
  start: () => void
}

export const useIgnition = create<IgnitionStore>((set) => ({
  startedAt: 0,
  start: () => set({ startedAt: performance.now() }),
}))
