'use client'

import { useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import { gsap } from 'gsap'
import { PROFILE } from '@/content/profile'
import { PaintChips } from '@/features/livery/PaintChips'
import { useLivery } from '@/features/livery/useLivery'

const HeroCanvas = dynamic(
  () => import('./HeroCanvas').then((m) => m.HeroCanvas),
  { ssr: false }
)

export function HeroSection() {
  const root = useRef<HTMLElement>(null)
  const livery = useLivery((s) => s.livery)

  // Lines rise out of a mask one after another, like a title card.
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-rise]', {
        yPercent: 110,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.08,
        delay: 0.15,
      })
      gsap.from('[data-fade]', {
        opacity: 0,
        y: 12,
        duration: 0.8,
        ease: 'power2.out',
        delay: 0.7,
        stagger: 0.08,
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const [first, last] = PROFILE.name.split(' ')

  return (
    <section
      ref={root}
      id="top"
      className="relative z-10 flex min-h-svh flex-col justify-between px-6 pt-28 pb-8 sm:px-10 lg:px-16 lg:pt-36 lg:pb-12"
    >
      <HeroCanvas />

      {/* Copy sits above the canvas but lets pointer events through to it. */}
      <div className="pointer-events-none relative max-w-[40rem]">
        <p
          data-fade
          className="text-ink/55 mb-5 text-[11px] tracking-[0.28em] uppercase"
        >
          {PROFILE.role} <span className="text-ink/30 mx-2">/</span> Portfolio
          ’26
        </p>
        <h1 className="text-ink text-[clamp(3.25rem,8.2vw,8rem)] leading-[0.86] font-semibold tracking-[-0.055em]">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-rise className="block">
              {first}
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-rise className="block">
              {last}
              <span className="text-accent">.</span>
            </span>
          </span>
        </h1>
        <p
          data-fade
          className="text-ink/80 font-display mt-6 max-w-md text-[clamp(1.5rem,2.4vw,2.1rem)] leading-[1.15]"
        >
          I design digital products that feel{' '}
          <em className="text-gradient pr-1">inevitable</em>.
        </p>
      </div>

      <div
        data-fade
        className="text-ink/50 pointer-events-none relative flex flex-wrap items-center justify-end gap-x-6 gap-y-2 text-[11px] tracking-[0.22em] uppercase"
      >
        <span>
          Finish{' '}
          <span className="text-ink ml-2 font-medium">{livery.name}</span>
        </span>
        <span className="max-sm:hidden">
          Turn the dial · Flip a switch · Tap the key
        </span>
        {/* Keyboard and screen-reader route to the same finishes as the dial. */}
        <PaintChips className="sr-only" />
      </div>
    </section>
  )
}
