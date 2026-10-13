'use client'

import { Backdrop } from '@/features/hero/Backdrop'
import { HeroSection } from '@/features/hero/HeroSection'
import { LiverySync } from '@/features/livery/LiverySync'
import { Nav } from '@/features/nav/Nav'
import { ProjectsSection } from '@/features/projects/ProjectsSection'
import { WorkSection } from '@/features/work/WorkSection'
import { ReadingSection } from '@/features/reading/ReadingSection'
import { AboutSection } from '@/features/about/AboutSection'
import { Footer } from '@/features/footer/Footer'

export default function Home() {
  return (
    <>
      <LiverySync />
      <Backdrop />
      <Nav />
      <main>
        <HeroSection />
        {/* The content sheet slides up over the hero, Apple product-page style. */}
        <div className="bg-canvas relative z-10 overflow-hidden rounded-t-[40px] shadow-[0_-30px_80px_-40px_rgb(0_0_0/0.35)] sm:rounded-t-[56px]">
          {/* Faint livery glows keep the sheet from going flat. */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="bg-g1 absolute top-[18%] -right-[20vw] h-[60vh] w-[45vw] rounded-full opacity-25 blur-[120px]" />
            <div className="bg-g2 absolute top-[55%] -left-[20vw] h-[60vh] w-[45vw] rounded-full opacity-20 blur-[120px]" />
            <div className="bg-g3 absolute -right-[15vw] bottom-[5%] h-[50vh] w-[40vw] rounded-full opacity-25 blur-[120px]" />
          </div>
          <ProjectsSection />
          <WorkSection />
          <ReadingSection />
          <AboutSection />
        </div>
        <div className="bg-canvas relative z-10 h-14 rounded-b-[40px] sm:rounded-b-[56px]" />
      </main>
      <Footer />
    </>
  )
}
