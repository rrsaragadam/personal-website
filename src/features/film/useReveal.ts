'use client'

import { useEffect, type RefObject } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

// Type arrives the way a slow pan reveals it: each `[data-reveal]` element's
// lines rise out of their own slot, staggered, once the block scrolls into
// view (or on load, with `immediate`).
export function useReveal(
  root: RefObject<HTMLElement | null>,
  { immediate = false, delay = 0 } = {}
) {
  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    let splits: SplitText[] = []
    const ctx = gsap.context(() => {
      const targets = el.querySelectorAll<HTMLElement>('[data-reveal]')
      splits = [...targets].map(
        (t) =>
          new SplitText(t, {
            type: t.dataset.reveal === 'chars' ? 'lines,chars' : 'lines,words',
            mask: 'lines',
            linesClass: 'line-mask',
          })
      )
      const parts = splits.flatMap((s) => (s.chars.length ? s.chars : s.words))
      gsap.from(parts, {
        yPercent: 110,
        rotate: 4,
        opacity: 0,
        duration: 1.1,
        ease: 'expo.out',
        stagger: 0.025,
        delay,
        scrollTrigger: immediate
          ? undefined
          : { trigger: el, start: 'top 78%', once: true },
      })
    }, el)

    return () => {
      ctx.revert()
      splits.forEach((s) => s.revert())
    }
  }, [root, immediate, delay])
}
