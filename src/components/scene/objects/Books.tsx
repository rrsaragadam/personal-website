'use client'

import { ModelObject } from './ModelObject'

const DESK_TOP_Y = 0.075

export function Books() {
  return (
    <ModelObject
      url="/models/books.glb"
      fit={{ fitMax: 1.55, surfaceY: DESK_TOP_Y }}
      position={[-2.15, 0, 0.05]}
      rotation={[0, 0.3, 0]}
      target="books"
      hoverIntensity={0.2}
    />
  )
}
