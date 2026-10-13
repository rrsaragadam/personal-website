'use client'

import {
  Bloom,
  EffectComposer,
  N8AO,
  Noise,
  SMAA,
  Vignette,
} from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

// The photographic layer. Ambient occlusion seats every part in its
// neighbours, bloom lets the lit glass and needles glow, and a little grain
// and vignette take the CG sheen off.
export function CabinEffects() {
  return (
    <EffectComposer multisampling={0}>
      <N8AO aoRadius={0.12} distanceFalloff={0.6} intensity={2.4} halfRes />
      <Bloom
        mipmapBlur
        luminanceThreshold={0.85}
        luminanceSmoothing={0.2}
        intensity={0.55}
      />
      <Vignette offset={0.28} darkness={0.55} />
      <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.35} />
      <SMAA />
    </EffectComposer>
  )
}
