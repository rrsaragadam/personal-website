'use client'

import dynamic from 'next/dynamic'
import { DayNightToggle } from '@/components/ui/DayNightToggle'
import { PanelOverlay } from '@/components/ui/PanelOverlay'

const DeskScene = dynamic(() => import('@/components/scene/DeskScene').then((m) => m.DeskScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#87ceeb]">
      <div className="text-white/60 font-sans text-sm tracking-widest uppercase">Loading</div>
    </div>
  ),
})

export default function Home() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">
      <DeskScene />
      <DayNightToggle />
      <PanelOverlay />
    </main>
  )
}
