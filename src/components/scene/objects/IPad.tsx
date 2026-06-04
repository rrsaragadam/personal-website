'use client'

import { ModelObject } from './ModelObject'

const DESK_TOP_Y = 0.075

// Tablet-on-keyboard-stand: the model's natural orientation already stands the
// screen up with the keyboard flat on the desk, facing the viewer (+Z).
export function IPad() {
  return (
    <ModelObject
      url="/models/tablet.glb"
      fit={{ fitMax: 1.0, surfaceY: DESK_TOP_Y }}
      position={[1.95, 0, 0.1]}
      rotation={[0, Math.PI + 1, 0]}
      target="ipad"
    />
  )
}
