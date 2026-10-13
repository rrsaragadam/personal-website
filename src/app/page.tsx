'use client'

import dynamic from 'next/dynamic'
import { Backdrop } from '@/features/livery/Backdrop'
import { LiverySync } from '@/features/livery/LiverySync'
import { A11yControls } from '@/features/console/A11yControls'

const ConsoleCanvas = dynamic(
  () => import('@/features/console/ConsoleCanvas').then((m) => m.ConsoleCanvas),
  { ssr: false }
)

// The console is the website: everything is reached through its controls.
export default function Home() {
  return (
    <main className="h-svh overflow-hidden">
      <LiverySync />
      <Backdrop />
      <A11yControls />
      <ConsoleCanvas />
      <p className="text-ink/45 pointer-events-none fixed inset-x-0 bottom-4 text-center font-mono text-[10px] tracking-[0.12em] uppercase sm:bottom-6 sm:text-[11px] sm:tracking-[0.22em]">
        <span className="max-sm:hidden">
          Scroll or drag to turn · Flip a switch · Tap the key
        </span>
        <span className="sm:hidden">
          Drag the knobs · Flip a switch · Tap the key
        </span>
      </p>
    </main>
  )
}
