'use client'

import dynamic from 'next/dynamic'
import { Hud } from '@/features/journal/Hud'

const Scene = dynamic(
  () => import('@/features/journal/Scene').then((m) => m.Scene),
  { ssr: false }
)

// The site is a field journal on a picnic table in the woods. Everything
// lives in its pages.
export default function Home() {
  return (
    <main className="h-svh overflow-hidden">
      <Scene />
      <Hud />
    </main>
  )
}
