'use client'

import { Canvas, useThree, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { OutlineEffect } from 'three/examples/jsm/effects/OutlineEffect.js'
import { Suspense, useMemo } from 'react'
import { Lighting } from './Lighting'
import { SceneEnvironment } from './SceneEnvironment'
import { Desk } from './Desk'
import { CameraController } from './camera/CameraController'

// Takes over the render loop (priority > 0) to draw the scene through
// OutlineEffect, which adds a back-face ink outline to every mesh — the comic
// look. Per-material userData.outlineParameters can disable/tune it.
function CartoonRenderer() {
  const { gl, scene, camera } = useThree()
  const effect = useMemo(
    () =>
      new OutlineEffect(gl as THREE.WebGLRenderer, {
        defaultThickness: 0.0045,
        defaultColor: [0.08, 0.06, 0.05],
        defaultAlpha: 0.95,
      }),
    [gl]
  )
  useFrame(() => effect.render(scene, camera), 1)
  return null
}

export function DeskScene() {
  return (
    <Canvas
      shadows
      camera={{ fov: 30, position: [0, 1.95, 8.2], near: 0.1, far: 200 }}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.22
      }}
      className="h-full w-full"
    >
      <Suspense fallback={null}>
        <Lighting />
        <SceneEnvironment />
        <Desk />
        <CameraController />
        <CartoonRenderer />
      </Suspense>
    </Canvas>
  )
}
