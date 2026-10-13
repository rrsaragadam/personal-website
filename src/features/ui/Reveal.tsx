'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

// Children with [data-reveal] rise and sharpen into place as the block enters
// the viewport, staggered so a section reads top to bottom.
export function Reveal({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.from('[data-reveal]', {
        y: 40,
        opacity: 0,
        filter: 'blur(8px)',
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        scrollTrigger: { trigger: root.current, start: 'top 80%' },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  return (
    <div ref={root} className={cn(className)}>
      {children}
    </div>
  )
}
