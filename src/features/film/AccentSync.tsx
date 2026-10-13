'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { useAccent } from '@/features/studio/useAccent'

// Carries the finish in focus into CSS, tweened so the type changes colour
// with the light rather than ahead of it.
export function AccentSync() {
  const accent = useAccent((s) => s.accent)

  useEffect(() => {
    gsap.to(document.documentElement, {
      '--accent': accent,
      duration: 0.8,
      ease: 'power2.inOut',
    })
  }, [accent])

  return null
}
