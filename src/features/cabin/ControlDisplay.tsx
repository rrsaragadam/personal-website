'use client'

import { forwardRef } from 'react'
import * as THREE from 'three'
import { Html, RoundedBox } from '@react-three/drei'
import { ScreenContent } from '@/features/screen/ScreenContent'
import { materials } from '@/features/console/materials'
import { Knob } from '@/features/console/Knob'
import { Toggle } from '@/features/console/Toggle'
import { ITEM_COUNT, SECTIONS, useConsole } from '@/features/console/useConsole'
import type { CabinLayout } from './layout'
import { Multigraph } from './Multigraph'

// The control display, floating on its ball joint and turned toward the
// driver. The site's content is real DOM projected onto its glass. Under it,
// a chin of switches (one per section) and a knurled select knob, then the
// aluminium handle you'd rest your palm on. The forwarded ref is the box the
// camera frames when it leans in to read.
export const ControlDisplay = forwardRef<
  THREE.Object3D,
  { layout: CabinLayout['display'] }
>(function ControlDisplay({ layout: L }, focus) {
  const m = materials()
  const mode = useConsole((s) => s.mode)
  const index = useConsole((s) => s.index)
  const bumpedAt = useConsole((s) => s.bumpedAt)
  const setMode = useConsole((s) => s.setMode)
  const setIndex = useConsole((s) => s.setIndex)

  const [w, h] = L.size
  const pxH = Math.round((L.px * h) / w)
  const chinY = -(h / 2 + 0.047)

  return (
    <group
      position={L.position}
      rotation={new THREE.Euler(L.pitch, L.yaw, 0, 'YXZ')}
    >
      <object3D
        ref={focus}
        position={[L.focus.x, L.focus.y, 0]}
        userData={{ width: L.focus.width, height: L.focus.height }}
      />

      {/* Ball joint and stalk down into the dashboard */}
      <mesh position={[0, -0.04, -0.05]} material={m.aluminiumPolished}>
        <sphereGeometry args={[0.03, 48, 32]} />
      </mesh>
      <mesh
        position={[0, -0.12, -0.14]}
        rotation-x={-0.85}
        material={m.anodised}
      >
        <cylinderGeometry args={[0.018, 0.026, 0.24, 32]} />
      </mesh>

      {/* Body: aluminium frame, screen, and a chin of controls */}
      <RoundedBox
        args={[w + 0.03, h + 0.03, 0.024]}
        radius={0.01}
        smoothness={5}
        position-z={-0.012}
        material={m.aluminium}
      />
      <RoundedBox
        args={[w + 0.03, 0.08, 0.034]}
        radius={0.012}
        smoothness={5}
        position={[0, chinY, -0.008]}
        material={m.aluminium}
      />
      <mesh position-z={0.0006}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#050507" />
      </mesh>
      <Html
        transform
        position-z={0.001}
        distanceFactor={(w * 400) / L.px}
        zIndexRange={[10, 0]}
      >
        <ScreenContent width={L.px} height={pxH} />
      </Html>

      <Multigraph position={[...L.multigraph, 0.004]} />

      {SECTIONS.map((s, i) => (
        <Toggle
          key={s.mode}
          label={s.label}
          position={[L.toggles[i], chinY + 0.006, 0.009]}
          rotation-x={Math.PI / 2}
          scale={0.07}
          on={mode === s.mode}
          onFlip={() => setMode(s.mode)}
        />
      ))}
      <group
        position={[L.knob, chinY, 0.009]}
        rotation-x={Math.PI / 2}
        scale={0.05}
      >
        <Knob
          count={ITEM_COUNT[mode]}
          value={index}
          onSelect={setIndex}
          bumpedAt={bumpedAt}
        />
      </group>

      {/* Palm-rest handle */}
      <mesh
        position={[0, chinY - 0.052, 0.022]}
        rotation-z={Math.PI / 2}
        material={m.aluminiumPolished}
      >
        <capsuleGeometry args={[0.008, w * 0.6, 8, 24]} />
      </mesh>
      {[-1, 1].map((sx) => (
        <mesh
          key={sx}
          position={[sx * w * 0.3, chinY - 0.044, 0.01]}
          rotation-x={0.5}
          material={m.aluminiumPolished}
        >
          <cylinderGeometry args={[0.005, 0.006, 0.026, 16]} />
        </mesh>
      ))}
    </group>
  )
})
