'use client'

import { cn } from '@/lib/utils'
import { LIVERIES } from './liveries'
import { useLivery } from './useLivery'

// The configurator row: each chip is a tiny lacquered swatch. The selected one
// lifts and gets a precise ring, and its name and paint code read out beside it.
export function PaintChips({ className }: { className?: string }) {
  const livery = useLivery((s) => s.livery)
  const setLivery = useLivery((s) => s.setLivery)

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <div className="flex items-baseline gap-3 text-[11px] tracking-[0.22em] uppercase">
        <span className="text-ink/45">Finish</span>
        <span className="text-ink font-medium">{livery.name}</span>
        <span className="text-ink/35 font-mono">{livery.code}</span>
      </div>
      <div
        role="radiogroup"
        aria-label="Choose a finish"
        className="flex items-center gap-2.5"
      >
        {LIVERIES.map((l) => {
          const active = l.id === livery.id
          return (
            <button
              key={l.id}
              role="radio"
              aria-checked={active}
              aria-label={l.name}
              onClick={() => setLivery(l.id)}
              className={cn(
                'chip relative size-9 rounded-full transition-all duration-300 ease-out',
                'ring-ink/0 ring-offset-canvas ring-2 ring-offset-2 hover:-translate-y-0.5 hover:scale-105',
                active && 'ring-ink/80 -translate-y-1 scale-110'
              )}
              // Per-chip colours are data, so they ride in as CSS variables.
              style={{
                ['--chip' as string]: l.paint,
                ['--chip-sheen' as string]: l.sheen,
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
