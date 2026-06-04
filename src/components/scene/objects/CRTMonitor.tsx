'use client'

import { ModelObject } from './ModelObject'

const DESK_TOP_Y = 0.075

export function CRTMonitor() {
  return (
    <ModelObject
      url="/models/crt.glb"
      fit={{ fitMax: 1.6, surfaceY: DESK_TOP_Y }}
      position={[1, 0, -0.8]}
      rotation={[0, -0.5, 0]}
      target="monitor"
      hoverIntensity={0.15}
    />
  )
}
