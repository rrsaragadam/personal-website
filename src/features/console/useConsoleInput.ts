'use client'

import { useEffect } from 'react'
import { LIVERIES } from '@/features/livery/liveries'
import { useLivery } from '@/features/livery/useLivery'
import { SECTIONS, useConsole } from './useConsole'
import { detent } from './detent'

// The console also answers the hardware people already have: the scroll
// wheel or trackpad turns the select knob, arrow keys step it, number keys
// throw the switches, C is the key and F turns the finish knob.
export function useConsoleInput() {
  useEffect(() => {
    let acc = 0
    let last = 0
    const turn = (delta: number) => {
      const { index, step } = useConsole.getState()
      step(delta)
      if (useConsole.getState().index !== index) detent()
    }

    const onWheel = (e: WheelEvent) => {
      // Let scrollable content inside the screen keep its own wheel.
      if ((e.target as HTMLElement).closest?.('[data-scrollable]')) return
      e.preventDefault()
      const now = performance.now()
      if (now - last > 400) acc = 0
      last = now
      acc += Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX
      if (Math.abs(acc) >= 90) {
        turn(Math.sign(acc))
        acc = 0
      }
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const { setMode } = useConsole.getState()
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') turn(1)
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') turn(-1)
      else if (/^[1-4]$/.test(e.key)) {
        setMode(SECTIONS[+e.key - 1].mode)
        detent(1.4)
      } else if (e.key === 'c' || e.key === 'C') {
        setMode('contact')
        detent(1.2)
      } else if (e.key === 'Escape' || e.key === '0') {
        useConsole.setState({ mode: 'home', index: 0 })
      } else if (e.key === 'f' || e.key === 'F') {
        const { livery, setLivery } = useLivery.getState()
        setLivery(LIVERIES[(LIVERIES.indexOf(livery) + 1) % LIVERIES.length].id)
        detent()
      } else return
      e.preventDefault()
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('keydown', onKey)
    }
  }, [])
}
