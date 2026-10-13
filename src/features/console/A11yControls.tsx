'use client'

import { LIVERIES } from '@/features/livery/liveries'
import { useLivery } from '@/features/livery/useLivery'
import { ITEM_COUNT, SECTIONS, useConsole } from './useConsole'
import { useIgnition } from './useIgnition'

// The console's controls as plain buttons, for keyboards and screen readers.
// Hidden until focused; when tabbed to, they appear as a small bar.
export function A11yControls() {
  const mode = useConsole((s) => s.mode)
  const index = useConsole((s) => s.index)
  const setMode = useConsole((s) => s.setMode)
  const step = useConsole((s) => s.step)
  const livery = useLivery((s) => s.livery)
  const setLivery = useLivery((s) => s.setLivery)
  const started = useIgnition((s) => s.startedAt > 0)
  const start = useIgnition((s) => s.start)

  const btn =
    'rounded-full px-3 py-1.5 text-xs text-ink/80 hover:bg-ink/10 aria-pressed:bg-ink aria-pressed:text-canvas'

  return (
    <nav
      aria-label="Console controls"
      className="glass sr-only fixed top-4 left-1/2 z-50 -translate-x-1/2 rounded-full p-1.5 focus-within:not-sr-only focus-within:flex focus-within:gap-1"
    >
      {!started && (
        <button className={btn} onClick={start}>
          Start
        </button>
      )}
      {SECTIONS.map((s) => (
        <button
          key={s.mode}
          className={btn}
          aria-pressed={mode === s.mode}
          onClick={() => setMode(s.mode)}
        >
          {s.label}
        </button>
      ))}
      <button
        className={btn}
        aria-pressed={mode === 'contact'}
        onClick={() => setMode('contact')}
      >
        Contact
      </button>
      <button className={btn} onClick={() => step(-1)} disabled={index === 0}>
        Previous
      </button>
      <button
        className={btn}
        onClick={() => step(1)}
        disabled={index >= ITEM_COUNT[mode] - 1}
      >
        Next
      </button>
      {LIVERIES.map((l) => (
        <button
          key={l.id}
          className={btn}
          aria-pressed={livery.id === l.id}
          onClick={() => setLivery(l.id)}
        >
          {l.name}
        </button>
      ))}
    </nav>
  )
}
