'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ArrowDown } from 'lucide-react'
import { PROFILE } from '@/content/profile'
import { PaintChips } from '@/features/livery/PaintChips'

export function HeroSection() {
  const root = useRef<HTMLElement>(null)

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
      className="relative z-10 flex min-h-svh flex-col justify-end px-6 pt-28 pb-10 sm:px-10 lg:px-16 lg:pb-14"
    >
      <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p
            data-fade
            className="text-ink/55 mb-5 text-[11px] tracking-[0.28em] uppercase"
          >
            {PROFILE.role} <span className="text-ink/30 mx-2">/</span> Portfolio
            ’26
          </p>
          <h1 className="text-ink text-[clamp(3.5rem,11vw,10.5rem)] leading-[0.86] font-semibold tracking-[-0.055em]">
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
            className="text-ink/80 font-display mt-6 max-w-2xl text-[clamp(1.5rem,2.6vw,2.25rem)] leading-[1.15]"
          >
            I design digital products that feel{' '}
            <em className="text-gradient pr-1">inevitable</em>.
          </p>
        </div>

        <div
          data-fade
          className="flex items-end justify-between gap-8 lg:flex-col lg:items-end"
        >
          <PaintChips />
          <a
            href="#projects"
            className="text-ink/60 hover:text-ink group flex items-center gap-2 text-[11px] tracking-[0.22em] uppercase transition-colors max-sm:hidden"
          >
            Scroll
            <ArrowDown
              size={14}
              strokeWidth={1.5}
              className="transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
