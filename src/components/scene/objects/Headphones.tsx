'use client'

import { ModelObject } from './ModelObject'

const DESK_TOP_Y = 0.075

// Headphones import standing upright; tip them so they lie flat on the desk.
export function Headphones() {
  return (
    <ModelObject
      url="/models/headphones.glb"
      fit={{ fitMax: 0.62, surfaceY: DESK_TOP_Y }}
      position={[-1.6, 0, 0.6]}
      rotation={[Math.PI + 1, 1, 0]}
    />
  )
}
