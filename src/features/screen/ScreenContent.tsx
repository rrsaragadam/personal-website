'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import {
  ITEM_COUNT,
  useConsole,
  type Mode,
} from '@/features/console/useConsole'
import { useIgnition } from '@/features/console/useIgnition'
import { ScreenFrame } from './ScreenFrame'
import {
  AboutScreen,
  ContactScreen,
  HomeScreen,
  ProjectScreen,
  ReadingScreen,
  WorkScreen,
} from './screens'

const LABELS: Record<Mode, string> = {
  home: 'Ready',
  projects: 'Projects',
  work: 'Work',
  reading: 'Reading',
  about: 'About',
  contact: 'Contact',
}

function Body({ mode, index }: { mode: Mode; index: number }) {
  if (mode === 'projects') return <ProjectScreen index={index} />
  if (mode === 'work') return <WorkScreen index={index} />
  if (mode === 'reading') return <ReadingScreen index={index} />
  if (mode === 'about') return <AboutScreen index={index} />
  if (mode === 'contact') return <ContactScreen />
  return <HomeScreen />
}

// The DOM that lives on the console's glass. It is real text and real links,
// projected onto the 3D screen, so it stays crisp, selectable and readable by
// assistive tech.
export function ScreenContent({
  width,
  height,
}: {
  width: number
  height: number
}) {
  const mode = useConsole((s) => s.mode)
  const index = useConsole((s) => s.index)
  const startedAt = useIgnition((s) => s.startedAt)
  const [lit, setLit] = useState(false)

  // The screen wakes a beat after ignition, and blinks off and on when the
  // key is tapped again.
  useEffect(() => {
    if (!startedAt) return
    setLit(false)
    const t = setTimeout(() => setLit(true), 450)
    return () => clearTimeout(t)
  }, [startedAt])

  return (
    <div
      style={{ width, height }}
      className={cn(
        'relative overflow-hidden rounded-[18px] bg-[#060608] p-9 text-white transition-opacity duration-700 select-text max-sm:p-7',
        lit ? 'opacity-100' : 'opacity-0'
      )}
      aria-live="polite"
    >
      {/* OLED glow in the livery's colours */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_70%_at_88%_20%,var(--g1),transparent_70%),radial-gradient(50%_60%_at_100%_100%,var(--g2),transparent_70%)] opacity-35" />
      {/* Cover-glass sheen */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(115deg,rgb(255_255_255/0.07)_0%,transparent_35%,transparent_70%,rgb(255_255_255/0.04)_100%)]" />
      <div className="relative h-full">
        <ScreenFrame
          label={LABELS[mode]}
          count={ITEM_COUNT[mode]}
          index={index}
        >
          <div
            key={`${mode}-${index}`}
            className="h-full animate-[fadeUp_0.45s_cubic-bezier(0.22,1,0.36,1)]"
          >
            <Body mode={mode} index={index} />
          </div>
        </ScreenFrame>
      </div>
    </div>
  )
}
