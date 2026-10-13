'use client'

import dynamic from 'next/dynamic'
import { AccentSync } from '@/features/film/AccentSync'
import { Masthead } from '@/features/film/Masthead'
import { Intro } from '@/features/film/Intro'
import { Projects } from '@/features/film/Projects'
import { Experience } from '@/features/film/Experience'
import { Reading } from '@/features/film/Reading'
import { Contact } from '@/features/film/Contact'
import { useSmoothScroll } from '@/features/film/useSmoothScroll'

const Stage = dynamic(
  () => import('@/features/stage/Stage').then((m) => m.Stage),
  { ssr: false }
)

// The site is a short film in five acts, played by scrolling: the type
// sits in front, and the objects live in one studio behind it.
export default function Home() {
  useSmoothScroll()

  return (
    <main className="relative">
      <AccentSync />
      <Stage />
      <Masthead />
      <Intro />
      <Projects />
      <Experience />
      <Reading />
      <Contact />
      <div
        aria-hidden
        className="grain pointer-events-none fixed -inset-[10%] z-40"
      />
    </main>
  )
}
