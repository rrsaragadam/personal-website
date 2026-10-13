'use client'

import { useEffect } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import {
  Bloom,
  DepthOfField,
  EffectComposer,
  N8AO,
  SMAA,
} from '@react-three/postprocessing'
import { Studio } from '@/features/studio/Studio'
import { easePointer, trackPointer } from '@/features/studio/pointer'
import { GlassKey } from './GlassKey'
import { SampleFan } from './SampleFan'
import { MetalCard } from './MetalCard'

// One fixed canvas behind the whole film. The objects never leave the
// studio; scroll moves them in and out of the light.
export function Stage() {
  useEffect(trackPointer, [])

  return (
    <div aria-hidden className="fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 2]}
        shadows="soft"
        camera={{ position: [0, 0, 6], fov: 30, near: 0.1, far: 40 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.AgXToneMapping
          gl.toneMappingExposure = 1.1
        }}
      >
        <color attach="background" args={['#060607']} />
        <Pointer />
        <Studio />
        <GlassKey />
        <SampleFan />
        <MetalCard />
        <EffectComposer multisampling={0}>
          <N8AO aoRadius={0.25} distanceFalloff={0.8} intensity={2} halfRes />
          <DepthOfField
            worldFocusDistance={6}
            worldFocusRange={1.4}
            bokehScale={3}
          />
          <Bloom
            mipmapBlur
            luminanceThreshold={0.9}
            luminanceSmoothing={0.15}
            intensity={0.4}
          />
          <SMAA />
        </EffectComposer>
      </Canvas>
    </div>
  )
}

function Pointer() {
  useFrame((_, dt) => easePointer(dt))
  return null
}
