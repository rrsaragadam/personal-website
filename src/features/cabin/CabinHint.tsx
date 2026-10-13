'use client'

import { useConsole } from '@/features/console/useConsole'
import { useIgnition } from '@/features/console/useIgnition'

// One quiet line at the foot of the page that says what the cabin will do
// next. It changes as you go: choose, then read.
export function CabinHint() {
  const started = useIgnition((s) => s.startedAt > 0)
  const reading = useConsole((s) => s.mode !== 'home')

  // Before the start, the key carries its own label.
  if (!started) return null
  const [wide, narrow] = reading
    ? [
        'Scroll or turn the knob to browse · Flip the switch again or press Home to sit back',
        'Turn the knob to browse · Flip again to sit back',
      ]
    : [
        'Flip a switch to read · Turn the wheel’s manettino to repaint',
        'Flip a switch · Turn the manettino',
      ]

  return (
    <p className="pointer-events-none fixed inset-x-0 bottom-4 z-30 flex justify-center sm:bottom-6">
      <span className="rounded-full bg-black/45 px-4 py-2 font-mono text-[10px] tracking-[0.12em] text-white/75 uppercase backdrop-blur-md sm:text-[11px] sm:tracking-[0.2em]">
        <span className="max-sm:hidden">{wide}</span>
        <span className="sm:hidden">{narrow}</span>
      </span>
    </p>
  )
}
