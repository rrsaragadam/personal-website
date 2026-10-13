import { create } from 'zustand'

// The start ritual: the glass key drops into its dock, then the binnacle
// and the control display wake in sequence. Nothing is lit until then.
interface IgnitionStore {
  startedAt: number
  start: () => void
}

export const useIgnition = create<IgnitionStore>((set, get) => ({
  startedAt: 0,
  start: () => {
    if (!get().startedAt) set({ startedAt: performance.now() })
  },
}))

// How lit a part is (0–1), `delay` seconds into the ritual.
export function litAmount(startedAt: number, delay: number, fade = 0.6) {
  if (!startedAt) return 0
  const t = (performance.now() - startedAt) / 1000 - delay
  return Math.min(1, Math.max(0, t / fade))
}
