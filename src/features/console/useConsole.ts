import { create } from 'zustand'
import { PROJECTS } from '@/content/projects'
import { WORK } from '@/content/work'
import { BOOKS } from '@/content/books'
import { PROFILE } from '@/content/profile'

export type Mode =
  | 'home'
  | 'projects'
  | 'work'
  | 'reading'
  | 'about'
  | 'contact'

export const SECTIONS: { mode: Mode; label: string }[] = [
  { mode: 'projects', label: 'Projects' },
  { mode: 'work', label: 'Work' },
  { mode: 'reading', label: 'Reading' },
  { mode: 'about', label: 'About' },
]

// How many detents the selector dial has in each mode.
export const ITEM_COUNT: Record<Mode, number> = {
  home: 1,
  projects: PROJECTS.length,
  work: WORK.length,
  reading: BOOKS.length,
  about: PROFILE.bio.length + 1, // each paragraph, then links
  contact: 1,
}

interface ConsoleStore {
  mode: Mode
  index: number
  // Bumped when the dial hits an end stop, so parts can react with a thunk.
  bumpedAt: number
  setMode: (mode: Mode) => void
  step: (delta: number) => void
  setIndex: (index: number) => void
}

export const useConsole = create<ConsoleStore>((set, get) => ({
  mode: 'home',
  index: 0,
  bumpedAt: 0,
  // Flipping the switch that is already down returns to the home screen.
  setMode: (mode) =>
    set({ mode: get().mode === mode ? 'home' : mode, index: 0 }),
  step: (delta) => get().setIndex(get().index + delta),
  setIndex: (index) => {
    const max = ITEM_COUNT[get().mode] - 1
    const clamped = Math.max(0, Math.min(max, index))
    if (clamped !== index) set({ bumpedAt: performance.now() })
    if (clamped !== get().index) set({ index: clamped })
  },
}))
