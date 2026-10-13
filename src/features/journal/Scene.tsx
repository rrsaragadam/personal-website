'use client'

import { Suspense } from 'react'
import * as THREE from 'three'
import { Canvas } from '@react-three/fiber'
import {
  Bloom,
  EffectComposer,
  N8AO,
  Noise,
  SMAA,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import { CameraRig } from './CameraRig'
import { Journal } from './Journal'
import { Outdoors } from './Outdoors'
import { Props } from './Props'

export function Scene() {
  return (
    <div className="fixed inset-0">
      <Canvas
        dpr={[1, 2]}
        shadows="soft"
        camera={{ position: [0.1, 1.6, 3.2], fov: 32, near: 0.05, far: 60 }}
        gl={{ antialias: false, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1
        }}
      >
        <Suspense fallback={null}>
          <Outdoors />
          <Journal />
          <Props />
          <CameraRig />
          <EffectComposer multisampling={0}>
            <N8AO
              aoRadius={0.15}
              distanceFalloff={0.5}
              intensity={2.2}
              halfRes
            />
            <Bloom mipmapBlur luminanceThreshold={0.95} intensity={0.25} />
            <Vignette offset={0.3} darkness={0.5} />
            <Noise
              premultiply
              blendFunction={BlendFunction.SOFT_LIGHT}
              opacity={0.12}
            />
            <SMAA />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  )
}
