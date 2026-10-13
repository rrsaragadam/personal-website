'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  useFrame,
  type ThreeElements,
  type ThreeEvent,
} from '@react-three/fiber'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from './materials'
import { detent } from './detent'

type KnobProps = ThreeElements['group'] & {
  count: number
  value: number
  onSelect: (index: number) => void
  radius?: number
  // Angle between detents. A full circle divided by count makes it endless.
  step?: number
  // Colour of the mark at each detent; plain engraved ticks when omitted.
  jewels?: string[]
  // Bumped when the selection hits an end stop: the knob shudders.
  bumpedAt?: number
}

// A turned-aluminium knob with a knurled edge and a glass crown. Drag it
// round and it clicks from detent to detent; a plain tap advances one.
export function Knob({
  count,
  value,
  onSelect,
  radius: R = 0.44,
  step = Math.PI / 6,
  jewels,
  bumpedAt = 0,
  ...props
}: KnobProps) {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const knob = useRef<THREE.Group>(null)
  const pointerMat = useRef<THREE.MeshStandardMaterial>(null)
  const endless = Math.abs(step * count - Math.PI * 2) < 1e-3
  // Detents are centred on twelve o'clock.
  const start = endless ? 0 : (-(count - 1) / 2) * step
  const angleOf = (i: number) => start + i * step

  const drag = useRef({ active: false, moved: 0, angle: 0, lastX: 0 })
  const angle = useRef(angleOf(value))
  const knurls = Math.round(R * 220)

  const knurlMatrices = useMemo(() => {
    const o = new THREE.Object3D()
    return Array.from({ length: knurls }, (_, i) => {
      const a = (i / knurls) * Math.PI * 2
      o.position.set(Math.cos(a) * R, 0, Math.sin(a) * R)
      o.rotation.set(0, -a, 0)
      o.updateMatrix()
      return o.matrix.clone()
    })
  }, [R, knurls])

  const knurlRef = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return
    knurlMatrices.forEach((mat, i) => mesh.setMatrixAt(i, mat))
    mesh.instanceMatrix.needsUpdate = true
  }

  const select = (i: number) => {
    const next = endless ? ((i % count) + count) % count : i
    if (next !== value) {
      onSelect(next)
      if (endless || (next >= 0 && next < count)) detent()
    }
  }

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drag.current = {
      active: true,
      moved: 0,
      angle: angleOf(value),
      lastX: e.clientX,
    }
  }
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.lastX
    d.lastX = e.clientX
    d.moved += Math.abs(dx)
    d.angle += dx * 0.012
    const i = Math.round((d.angle - start) / step)
    if (i !== value) select(i)
  }
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    if (d.moved < 4)
      select(endless ? value + 1 : value + 1 < count ? value + 1 : 0)
  }

  useFrame((_, dt) => {
    const d = drag.current
    // Follows the finger while dragging (but not past the end stops),
    // otherwise settles into its detent; shudders briefly at an end stop.
    const lo = angleOf(0) - step * 0.35
    const hi = angleOf(count - 1) + step * 0.35
    let target = d.active
      ? endless
        ? d.angle
        : THREE.MathUtils.clamp(d.angle, lo, hi)
      : angleOf(value)
    const sinceBump = (performance.now() - bumpedAt) / 1000
    if (sinceBump < 0.25)
      target += Math.sin(sinceBump * 60) * 0.04 * (1 - sinceBump / 0.25)
    let delta = target - angle.current
    if (endless && !d.active)
      delta = Math.atan2(Math.sin(delta), Math.cos(delta))
    angle.current += delta * (1 - Math.exp(-dt * (d.active ? 20 : 12)))
    if (knob.current) knob.current.rotation.y = -angle.current
    pointerMat.current?.color.lerp(
      new THREE.Color(livery.accent[0]),
      1 - Math.exp(-dt * 4)
    )
  })

  return (
    <group {...props}>
      {/* Recessed collar */}
      <mesh material={m.anodised} position-y={0.01}>
        <cylinderGeometry args={[R + 0.07, R + 0.07, 0.03, 96]} />
      </mesh>

      {/* Detent marks: lacquered jewels or engraved ticks */}
      {Array.from({ length: count }, (_, i) => {
        const a = angleOf(i) - Math.PI / 2
        const active = i === value
        const pos: [number, number, number] = [
          Math.cos(a) * (R + 0.18),
          0.02,
          Math.sin(a) * (R + 0.18),
        ]
        return jewels ? (
          <mesh key={i} position={pos} scale={active ? 1.3 : 1}>
            <sphereGeometry args={[0.04, 32, 32]} />
            <meshPhysicalMaterial
              color={jewels[i]}
              roughness={0.1}
              clearcoat={1}
              emissive={jewels[i]}
              emissiveIntensity={active ? 0.7 : 0.05}
            />
          </mesh>
        ) : (
          <mesh key={i} position={pos} rotation-y={-a}>
            <boxGeometry args={[active ? 0.09 : 0.06, 0.01, 0.014]} />
            <meshBasicMaterial
              color={active ? livery.accent[0] : '#2b2c31'}
              toneMapped={false}
            />
          </mesh>
        )
      })}

      <group
        ref={knob}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
      >
        <mesh
          position-y={0.12}
          material={[
            m.aluminiumPolished,
            m.aluminiumTurned,
            m.aluminiumPolished,
          ]}
        >
          <cylinderGeometry args={[R, R, 0.2, 128]} />
        </mesh>
        <instancedMesh
          ref={knurlRef}
          args={[undefined, undefined, knurls]}
          position-y={0.12}
          material={m.aluminium}
        >
          <boxGeometry args={[0.018, 0.17, 0.02]} />
        </instancedMesh>
        {/* Glass crown */}
        <mesh position-y={0.235} material={m.glass}>
          <cylinderGeometry args={[R * 0.24, R * 0.26, 0.035, 64]} />
        </mesh>
        <mesh position-y={0.221}>
          <cylinderGeometry args={[R * 0.2, R * 0.2, 0.002, 64]} />
          <meshStandardMaterial color="#141418" roughness={0.6} />
        </mesh>
        {/* Indicator dot */}
        <mesh position={[0, 0.222, -(R - 0.08)]}>
          <cylinderGeometry args={[0.022, 0.022, 0.006, 24]} />
          <meshStandardMaterial
            ref={pointerMat}
            color={livery.accent[0]}
            toneMapped={false}
          />
        </mesh>
      </group>
    </group>
  )
}
