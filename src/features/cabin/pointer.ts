'use client'

import { useEffect } from 'react'

// Where the mouse is, from -1 to 1 on each axis. The camera reads it as a
// small head movement and the wheel as a hint of steering. Touch input is
// ignored: there it would lurch with every tap.
export const pointer = { x: 0, y: 0 }

export function usePointerTracking() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])
}
