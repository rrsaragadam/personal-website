'use client'

import { useRef, useCallback } from 'react'
import { Sun, Moon } from 'lucide-react'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'

export function DayNightToggle() {
  const iconRef = useRef<HTMLDivElement>(null)
  const { isDayMode, toggleDayMode } = useSceneStore()

  const handleClick = useCallback(() => {
    toggleDayMode()
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        rotation: '+=360',
        duration: 0.65,
        ease: 'back.out(1.4)',
      })
    }
  }, [toggleDayMode])

  return (
    <button
      onClick={handleClick}
      className="fixed right-6 top-6 z-50 rounded-full border border-white/30 bg-white/20 p-3 text-white backdrop-blur-sm transition-colors hover:bg-white/30 active:scale-95"
      aria-label="Toggle day/night mode"
    >
      <div ref={iconRef}>
        {isDayMode ? <Sun size={20} strokeWidth={1.5} /> : <Moon size={20} strokeWidth={1.5} />}
      </div>
    </button>
  )
}
