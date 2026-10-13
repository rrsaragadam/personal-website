'use client'

import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { useFrame, type ThreeElements } from '@react-three/fiber'
import { LIVERIES } from '@/features/livery/liveries'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from '@/features/console/materials'
import { Knob } from '@/features/console/Knob'
import { MONO, SANS, textTexture } from '@/features/console/textures'
import { useConsole } from '@/features/console/useConsole'
import { detent } from '@/features/console/detent'
import { pointer } from './pointer'

const R = 0.185

// A flat face lying in the wheel's plane, printed with text.
function Plate({
  size,
  draw,
  ...props
}: ThreeElements['mesh'] & {
  size: number
  draw: (ctx: CanvasRenderingContext2D, s: number) => void
}) {
  const tex = useMemo(
    () => textTexture(256, 256, (ctx, s) => draw(ctx, s)),
    [draw]
  )
  return (
    <mesh {...props}>
      <circleGeometry args={[size, 48]} />
      <meshBasicMaterial map={tex.tex} transparent toneMapped={false} />
    </mesh>
  )
}

const drawMonogram = (ctx: CanvasRenderingContext2D, s: number) => {
  ctx.fillStyle = 'rgba(232,233,238,0.92)'
  ctx.font = `600 ${s * 0.22}px ${SANS}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('RS', s / 2, s / 2 + s * 0.02)
}
const drawHome = (ctx: CanvasRenderingContext2D, s: number) => {
  ctx.fillStyle = 'rgba(242,242,245,0.9)'
  ctx.font = `600 ${s * 0.17}px ${MONO}`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = `${s * 0.02}px`
  ctx.fillText('HOME', s / 2, s / 2)
}

// The left pod's push button: takes the cabin back to the driver's view.
function HomeButton(props: ThreeElements['group']) {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const cap = useRef<THREE.Group>(null)
  const pressedAt = useRef(-1e9)
  const [hover, setHover] = useState(false)

  useFrame(() => {
    const t = (performance.now() - pressedAt.current) / 1000
    const press = t < 0.18 ? Math.sin((t / 0.18) * Math.PI) : 0
    if (cap.current) cap.current.position.z = 0.006 - press * 0.004
  })

  return (
    <group {...props}>
      <mesh rotation-x={Math.PI / 2} material={m.anodised}>
        <cylinderGeometry args={[0.024, 0.026, 0.01, 48]} />
      </mesh>
      <mesh position-z={0.0052}>
        <ringGeometry args={[0.0165, 0.0185, 48]} />
        <meshBasicMaterial color={livery.accent[0]} toneMapped={false} />
      </mesh>
      <group
        ref={cap}
        onClick={(e) => {
          e.stopPropagation()
          pressedAt.current = performance.now()
          detent(1.2)
          useConsole.setState({ mode: 'home', index: 0 })
        }}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHover(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHover(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <mesh rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.015, 0.015, 0.008, 48]} />
          <meshPhysicalMaterial
            color={hover ? '#2a2a30' : '#16161a'}
            roughness={0.25}
            clearcoat={1}
          />
        </mesh>
        <Plate size={0.015} draw={drawHome} position-z={0.0042} />
      </group>
    </group>
  )
}

// A three-spoke wheel after the 1950s Nardi: a slim leather rim on an
// exposed aluminium structure, each spoke a pair of bars. The right pod is
// the manettino, which turns the finish; the left pod returns home.
export function SteeringWheel(props: ThreeElements['group']) {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const setLivery = useLivery((s) => s.setLivery)
  const turn = useRef<THREE.Group>(null)

  const stripe = useMemo(
    () => new THREE.MeshStandardMaterial({ roughness: 0.5 }),
    []
  )
  stripe.color.set(livery.accent[0])

  useFrame((_, dt) => {
    if (turn.current)
      turn.current.rotation.z +=
        (-pointer.x * 0.1 - turn.current.rotation.z) * (1 - Math.exp(-dt * 3))
  })

  const bar = (
    key: string,
    from: [number, number],
    to: [number, number],
    offset: number
  ) => {
    const dx = to[0] - from[0]
    const dy = to[1] - from[1]
    const len = Math.hypot(dx, dy)
    const a = Math.atan2(dy, dx)
    const nx = -Math.sin(a) * offset
    const ny = Math.cos(a) * offset
    return (
      <mesh
        key={key}
        position={[(from[0] + to[0]) / 2 + nx, (from[1] + to[1]) / 2 + ny, 0]}
        rotation-z={a}
        material={m.aluminiumPolished}
      >
        <boxGeometry args={[len, 0.007, 0.009]} />
      </mesh>
    )
  }

  return (
    <group {...props}>
      {/* Column */}
      <mesh rotation-x={Math.PI / 2} position-z={-0.2} material={m.anodised}>
        <cylinderGeometry args={[0.032, 0.04, 0.36, 32]} />
      </mesh>

      <group ref={turn}>
        {/* Rim, with a stripe of the finish at twelve o'clock */}
        <mesh material={m.leather}>
          <torusGeometry args={[R, 0.0155, 32, 180]} />
        </mesh>
        <mesh rotation-z={Math.PI / 2 - 0.06} material={stripe}>
          <torusGeometry args={[R, 0.0158, 32, 12, 0.12]} />
        </mesh>
        {/* Exposed structure inside the rim */}
        <mesh material={m.aluminium} position-z={-0.004}>
          <torusGeometry args={[R - 0.012, 0.004, 12, 180]} />
        </mesh>

        {/* Spokes: pairs of bars, as on the Nardi */}
        {bar('l1', [-0.045, 0], [-R + 0.012, 0], 0.012)}
        {bar('l2', [-0.045, 0], [-R + 0.012, 0], -0.012)}
        {bar('r1', [0.045, 0], [R - 0.012, 0], 0.012)}
        {bar('r2', [0.045, 0], [R - 0.012, 0], -0.012)}
        {bar('b1', [0, -0.045], [0, -R + 0.012], 0.014)}
        {bar('b2', [0, -0.045], [0, -R + 0.012], -0.014)}

        {/* Hub */}
        <mesh rotation-x={Math.PI / 2} material={m.anodised}>
          <cylinderGeometry args={[0.05, 0.054, 0.03, 64]} />
        </mesh>
        <mesh
          rotation-x={Math.PI / 2}
          position-z={0.016}
          material={[m.aluminiumPolished, m.anodised, m.anodised]}
        >
          <cylinderGeometry args={[0.04, 0.042, 0.004, 64]} />
        </mesh>
        <Plate size={0.038} draw={drawMonogram} position-z={0.0185} />

        {/* Pods under the horizontal spokes */}
        <HomeButton position={[-0.098, -0.052, 0.006]} />
        <group position={[0.098, -0.052, 0.006]}>
          <mesh rotation-x={Math.PI / 2} material={m.anodised}>
            <cylinderGeometry args={[0.032, 0.034, 0.01, 48]} />
          </mesh>
          <group rotation-x={Math.PI / 2} position-z={0.005} scale={0.042}>
            <Knob
              count={LIVERIES.length}
              step={(Math.PI * 2) / LIVERIES.length}
              value={LIVERIES.indexOf(livery)}
              onSelect={(i) => setLivery(LIVERIES[i].id)}
              jewels={LIVERIES.map((l) => l.paint)}
            />
          </group>
        </group>
      </group>
    </group>
  )
}
