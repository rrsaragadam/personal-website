'use client'

import { ModelObject } from './ModelObject'

const DESK_TOP_Y = 0.075

// Phone imports standing; lay it flat with the screen facing up, and keep it small.
export function Phone() {
  return (
    <ModelObject
      url="/models/phone.glb"
      fit={{ fitMax: 0.46, surfaceY: DESK_TOP_Y }}
      position={[0.95, 0, 0.55]}
      rotation={[-Math.PI / 2, 0, 0]}
    />
  )
}
