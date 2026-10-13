'use client'

import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { useConsoleInput } from '@/features/console/useConsoleInput'
import { Cabin } from './Cabin'
import { CabinEffects } from './CabinEffects'
import { CabinLights } from './CabinLights'
import { usePointerTracking } from './pointer'

export function CabinCanvas() {
  useConsoleInput()
  usePointerTracking()
  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={[1, 2]}
        shadows="soft"
        camera={{ position: [0, 1.2, 1], fov: 46, near: 0.02, far: 30 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <CabinLights />
        <Cabin />
        <CabinEffects />
      </Canvas>
    </div>
  )
}
