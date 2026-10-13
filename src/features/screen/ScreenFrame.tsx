import type { ReactNode } from 'react'

// Shared layout for every screen: a status bar, the content, and a row of
// position dots that mirror the selector dial's detents.
interface ScreenFrameProps {
  label: string
  count: number
  index: number
  children: ReactNode
}

export function ScreenFrame({
  label,
  count,
  index,
  children,
}: ScreenFrameProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between font-mono text-[13px] tracking-[0.2em] text-white/45 uppercase">
        <span>Rishi Saragadam</span>
        <span className="text-white/80">{label}</span>
        <span>
          {count > 1
            ? `${String(index + 1).padStart(2, '0')} / ${String(count).padStart(2, '0')}`
            : '—'}
        </span>
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
      {count > 1 && (
        <div className="flex items-center justify-center gap-2.5">
          {Array.from({ length: count }, (_, i) => (
            <span
              key={i}
              className={
                i === index
                  ? 'bg-accent h-1.5 w-6 rounded-full transition-all duration-300'
                  : 'h-1.5 w-1.5 rounded-full bg-white/25 transition-all duration-300'
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
