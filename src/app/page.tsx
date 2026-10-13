'use client'

import dynamic from 'next/dynamic'
import { Backdrop } from '@/features/livery/Backdrop'
import { LiverySync } from '@/features/livery/LiverySync'
import { A11yControls } from '@/features/console/A11yControls'
import { CabinHint } from '@/features/cabin/CabinHint'

const CabinCanvas = dynamic(
  () => import('@/features/cabin/CabinCanvas').then((m) => m.CabinCanvas),
  { ssr: false }
)

// The cabin is the website: everything is reached through its controls.
export default function Home() {
  return (
    <main className="h-svh overflow-hidden">
      <LiverySync />
      <Backdrop />
      <A11yControls />
      <CabinCanvas />
      {/* Vignette, so the cabin reads as a space you're sitting in */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-20 bg-[radial-gradient(120%_95%_at_50%_40%,transparent_55%,rgb(0_0_0/0.28))]"
      />
      <CabinHint />
    </main>
  )
}
