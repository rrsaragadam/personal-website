'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { useConsole } from '@/features/console/useConsole'
import { useIgnition } from '@/features/console/useIgnition'
import { LANDSCAPE, PORTRAIT } from './layout'
import { CameraRig } from './CameraRig'
import { Dashboard } from './Dashboard'
import { Binnacle } from './Binnacle'
import { SteeringWheel } from './SteeringWheel'
import { ControlDisplay } from './ControlDisplay'
import { CenterConsole } from './CenterConsole'

// The whole site, seen from the driver's seat of a cabin in the spirit of
// the Ferrari Luce: binnacle on the column, three-spoke wheel, a control
// display on a ball joint, and a glass key that starts it all.
export function Cabin() {
  const focus = useRef<THREE.Object3D>(null)
  const { size } = useThree()
  const L = size.width < size.height ? PORTRAIT : LANDSCAPE
  const mode = useConsole((s) => s.mode)
  const start = useIgnition((s) => s.start)

  useEffect(() => {
    // Reaching for any control also starts the car; so does waiting a while,
    // or asking for less motion.
    if (mode !== 'home') start()
  }, [mode, start])
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const t = setTimeout(start, reduce ? 0 : 9000)
    return () => clearTimeout(t)
  }, [start])

  return (
    <>
      <CameraRig focus={focus} />
      <Dashboard />
      <Binnacle position={[0, 0.93, -0.02]} rotation-x={-0.2} />
      <SteeringWheel position={[0, 0.9, 0.42]} rotation-x={-0.42} />
      <ControlDisplay ref={focus} layout={L.display} />
      <CenterConsole />
    </>
  )
}
