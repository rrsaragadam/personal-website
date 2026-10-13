'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import {
  useFrame,
  type ThreeElements,
  type ThreeEvent,
} from '@react-three/fiber'
import { LIVERIES } from '@/features/livery/liveries'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from './materials'
import { detent } from './detent'

const STEP = (Math.PI * 2) / LIVERIES.length
const KNURLS = 96
const R = 0.44

// The finish selector: a turned-aluminium knob with a knurled edge and a glass
// crown. Drag it round and it clicks through one detent per finish, each
// marked by a lacquered jewel set into the plate; a plain tap advances one.
export function Dial(props: ThreeElements['group']) {
  const m = materials()
  const knob = useRef<THREE.Group>(null)
  const pointerMat = useRef<THREE.MeshStandardMaterial>(null)
  const livery = useLivery((s) => s.livery)
  const setLivery = useLivery((s) => s.setLivery)
  const index = LIVERIES.indexOf(livery)

  const drag = useRef({ active: false, moved: 0, angle: 0, lastX: 0 })
  const angle = useRef(0) // displayed angle, eases toward the target

  const knurlMatrices = useMemo(() => {
    const o = new THREE.Object3D()
    return Array.from({ length: KNURLS }, (_, i) => {
      const a = (i / KNURLS) * Math.PI * 2
      o.position.set(Math.cos(a) * R, 0, Math.sin(a) * R)
      o.rotation.set(0, -a, 0)
      o.updateMatrix()
      return o.matrix.clone()
    })
  }, [])

  const knurlRef = (mesh: THREE.InstancedMesh | null) => {
    if (!mesh) return
    knurlMatrices.forEach((mat, i) => mesh.setMatrixAt(i, mat))
    mesh.instanceMatrix.needsUpdate = true
  }

  const select = (i: number) => {
    const wrapped = ((i % LIVERIES.length) + LIVERIES.length) % LIVERIES.length
    if (LIVERIES[wrapped].id !== useLivery.getState().livery.id) {
      setLivery(LIVERIES[wrapped].id)
      detent()
    }
  }

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    ;(e.target as Element).setPointerCapture?.(e.pointerId)
    drag.current = {
      active: true,
      moved: 0,
      angle: -index * STEP,
      lastX: e.clientX,
    }
  }
  const onMove = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current
    if (!d.active) return
    const dx = e.clientX - d.lastX
    d.lastX = e.clientX
    d.moved += Math.abs(dx)
    d.angle -= dx * 0.012
    select(Math.round(-d.angle / STEP))
  }
  const onUp = (e: ThreeEvent<PointerEvent>) => {
    const d = drag.current
    if (!d.active) return
    d.active = false
    ;(e.target as Element).releasePointerCapture?.(e.pointerId)
    if (d.moved < 4) select(index + 1)
  }

  useFrame((_, dt) => {
    const d = drag.current
    // While dragging the knob follows the finger; otherwise it settles into
    // the detent with a little spring.
    const target = d.active ? d.angle : -index * STEP
    const current = angle.current
    // Take the short way round when wrapping from the last finish to the first.
    let delta = target - current
    if (!d.active) delta = Math.atan2(Math.sin(delta), Math.cos(delta))
    angle.current = current + delta * (1 - Math.exp(-dt * (d.active ? 20 : 10)))
    if (knob.current) knob.current.rotation.y = angle.current
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

      {/* Lacquered jewels marking each detent */}
      {LIVERIES.map((l, i) => {
        const a = i * STEP - Math.PI / 2
        const active = i === index
        return (
          <mesh
            key={l.id}
            position={[Math.cos(a) * (R + 0.2), 0.02, Math.sin(a) * (R + 0.2)]}
            scale={active ? 1.25 : 1}
          >
            <sphereGeometry args={[0.04, 32, 32]} />
            <meshPhysicalMaterial
              color={l.paint}
              roughness={0.1}
              clearcoat={1}
              emissive={l.paint}
              emissiveIntensity={active ? 0.6 : 0.05}
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
        {/* Body: knurled side, turned face */}
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
          args={[undefined, undefined, KNURLS]}
          position-y={0.12}
          material={m.aluminium}
        >
          <boxGeometry args={[0.018, 0.17, 0.02]} />
        </instancedMesh>
        {/* Glass crown */}
        <mesh position-y={0.235} material={m.glass}>
          <cylinderGeometry args={[0.1, 0.11, 0.035, 64]} />
        </mesh>
        <mesh position-y={0.221}>
          <cylinderGeometry args={[0.085, 0.085, 0.002, 64]} />
          <meshStandardMaterial color="#141418" roughness={0.6} />
        </mesh>
        {/* Indicator: points at the selected jewel */}
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
