import { create } from 'zustand'
import { SPREADS } from './spreads'

// Which spread is open. 0 is the closed journal; 1…n are spreads, each
// showing the back of leaf (n-1) on the left and the front of leaf n on the
// right. On phones only one page fits, so `side` says which is in view.
interface JournalStore {
  spread: number
  side: 'left' | 'right'
  open: () => void
  close: () => void
  go: (spread: number) => void
  next: () => void
  prev: () => void
}

const last = SPREADS.length

const portrait = () =>
  typeof window !== 'undefined' && window.innerWidth < window.innerHeight

export const useJournal = create<JournalStore>((set, get) => ({
  spread: 0,
  side: 'left',
  open: () => set({ spread: 1, side: 'left' }),
  close: () => set({ spread: 0, side: 'left' }),
  go: (spread) =>
    set({ spread: Math.max(0, Math.min(last, spread)), side: 'left' }),
  next: () => {
    const { spread, side } = get()
    if (spread > 0 && portrait() && side === 'left')
      return set({ side: 'right' })
    if (spread < last) set({ spread: spread + 1, side: 'left' })
  },
  prev: () => {
    const { spread, side } = get()
    if (spread > 0 && portrait() && side === 'right')
      return set({ side: 'left' })
    if (spread > 0)
      set({ spread: spread - 1, side: spread > 1 ? 'right' : 'left' })
  },
}))
