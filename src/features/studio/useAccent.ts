import { create } from 'zustand'

// The colour of whatever is in focus. The studio light, the type accents and
// the selection colour all follow it, so the page takes on each project's
// anodised finish as you reach it.
export const BASE_ACCENT = '#ff5b1f'

interface AccentStore {
  accent: string
  setAccent: (accent: string) => void
}

export const useAccent = create<AccentStore>((set, get) => ({
  accent: BASE_ACCENT,
  setAccent: (accent) => {
    if (get().accent !== accent) set({ accent })
  },
}))
