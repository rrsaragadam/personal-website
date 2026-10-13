'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { PROFILE } from '@/content/profile'
import { Act } from './Act'
import { useReveal } from './useReveal'

// Act one: the name, set in four voices, with the glass key turning in the
// light beside it. Scrolling pulls the words apart as the key lifts away.
export function Intro() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref, { immediate: true, delay: 0.3 })

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          // Selectors are scoped to `el` inside this context, so pass the
          // section itself.
          trigger: el.closest('section'),
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
        },
      })
      tl.to('[data-drift="first"]', { xPercent: -12, yPercent: -30 }, 0)
        .to('[data-drift="last"]', { xPercent: 10 }, 0)
        .to('[data-drift="line"]', { yPercent: 60, opacity: 0 }, 0)
        .to(el, { opacity: 0, duration: 0.6, ease: 'power1.in' }, 0.2)
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <Act id="intro" length="h-[220svh]" label="Introduction">
      <div ref={ref} className="relative h-full px-6 md:px-[6vw]">
        <p className="absolute top-[17svh] font-mono text-[11px] tracking-[0.3em] uppercase opacity-60">
          <span data-reveal>(01) — {PROFILE.role}</span>
        </p>

        <h1 className="absolute top-[22svh] left-6 md:left-[5vw]">
          <span
            data-drift="first"
            data-reveal="chars"
            className="font-display block text-[30vw] leading-[0.82] tracking-[-0.02em] italic md:text-[17vw]"
          >
            Rishi
          </span>
          <span
            data-drift="last"
            data-reveal="chars"
            className="block pl-[0.06em] font-sans text-[13vw] leading-[0.9] font-black tracking-[-0.045em] uppercase md:text-[8.2vw]"
          >
            Saragadam
          </span>
        </h1>

        <p
          data-drift="line"
          className="absolute bottom-[14svh] left-6 flex max-w-[52rem] flex-wrap items-baseline gap-x-[0.9em] gap-y-2 md:left-[6vw]"
        >
          <span
            data-reveal
            className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-60"
          >
            who designs
          </span>
          <span
            data-reveal
            className="text-[7vw] font-extralight tracking-[0.32em] md:text-[2.6vw]"
          >
            software
          </span>
          <span
            data-reveal
            className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-60"
          >
            that feels
          </span>
          <span
            data-reveal
            className="font-display text-accent text-[12vw] leading-none italic md:text-[5.4vw]"
          >
            machined.
          </span>
        </p>

        <p className="absolute top-1/2 right-6 hidden -translate-y-1/2 font-mono text-[10px] tracking-[0.4em] uppercase opacity-45 [writing-mode:vertical-rl] md:block">
          Take your time — the studio is open
        </p>
        <p className="absolute right-6 bottom-8 font-mono text-[11px] tracking-[0.3em] uppercase opacity-60 md:right-10">
          Scroll ↓
        </p>
      </div>
    </Act>
  )
}
