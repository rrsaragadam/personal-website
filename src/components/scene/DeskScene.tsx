'use client'

import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { Lighting } from './Lighting'
import { SceneEnvironment } from './SceneEnvironment'
import { Desk } from './Desk'
import { CameraController } from './camera/CameraController'

export function DeskScene() {
  return (
    <Canvas
      shadows
      camera={{ fov: 45, position: [0, 4.5, 11], near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <Lighting />
        <SceneEnvironment />
        <Desk />
        <CameraController />
      </Suspense>
    </Canvas>
  )
}
