'use client'

import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import { Console } from './Console'
import { StudioLights } from './StudioLights'
import { useConsoleInput } from './useConsoleInput'

export function ConsoleCanvas() {
  useConsoleInput()
  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 9], fov: 25 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.1
        }}
      >
        <StudioLights />
        <Console />
      </Canvas>
    </div>
  )
}
