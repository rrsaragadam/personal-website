'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { useLivery } from './useLivery'

// Pushes the active livery into CSS custom properties on <html>, tweening
// between finishes so the whole page repaints in one physical sweep.
export function LiverySync() {
  const livery = useLivery((s) => s.livery)
  const first = useRef(true)

  useEffect(() => {
    const root = document.documentElement
    const vars = {
      '--g1': livery.gradient[0],
      '--g2': livery.gradient[1],
      '--g3': livery.gradient[2],
      '--g4': livery.gradient[3],
      '--canvas': livery.canvas,
      '--ink': livery.ink,
      '--paint': livery.paint,
      '--sheen': livery.sheen,
      '--accent': livery.accent[0],
      '--accent-2': livery.accent[1],
    }
    root.dataset.dark = String(livery.dark)
    gsap.to(root, {
      ...vars,
      duration: first.current ? 0 : 0.9,
      ease: 'power2.inOut',
    })
    first.current = false
  }, [livery])

  return null
}
