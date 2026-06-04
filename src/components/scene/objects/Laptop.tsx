'use client'

import { ModelObject } from './ModelObject'
import { LaptopScreen } from './LaptopScreen'

const DESK_TOP_Y = 0.075

export function Laptop() {
  return (
    <ModelObject
      url="/models/laptop.glb"
      fit={{ fitMax: 1.25, surfaceY: DESK_TOP_Y }}
      position={[-0.35, 0, 0.45]}
      rotation={[0, 0, 0]}
      target="laptop"
    >
      <LaptopScreen
        position={[0, 0.5, -0.28]}
        rotation={[-0.32, 0, 0]}
        size={[0.92, 0.56]}
      />
    </ModelObject>
  )
}
