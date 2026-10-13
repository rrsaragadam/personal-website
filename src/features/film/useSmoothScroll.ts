'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { measure, scroll } from './scroll'

gsap.registerPlugin(ScrollTrigger)

// Weighted, inertial scrolling, so the film plays at the pace of a hand
// rather than a notched wheel. Lenis drives ScrollTrigger and the stage.
export function useSmoothScroll() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const lenis = new Lenis({
      lerp: reduce ? 1 : 0.075,
      wheelMultiplier: 0.8,
      anchors: true,
    })
    const onScroll = () => {
      scroll.y = lenis.scroll
      ScrollTrigger.update()
    }
    lenis.on('scroll', onScroll)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    const onResize = () => {
      measure()
      scroll.y = window.scrollY
    }
    onResize()
    window.addEventListener('resize', onResize)
    document.fonts?.ready.then(onResize)

    return () => {
      gsap.ticker.remove(tick)
      window.removeEventListener('resize', onResize)
      lenis.destroy()
    }
  }, [])
}
