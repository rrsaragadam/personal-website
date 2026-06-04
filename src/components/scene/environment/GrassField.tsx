'use client'

import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'
import { paletteFor } from '@/lib/sceneConfig'
import { disableOutline } from '@/lib/toon'

const TUFT_COUNT = 11000
const CLOVER_COUNT = 2200
const FLOWER_COUNT = 680
const FIELD_RADIUS = 34
const GROUND_Y = -1.3

// The ground is the top cap of a large sphere ("tiny planet") so the horizon
// reads as a gentle convex arc and the grass falls away on the sides.
const PLANET_R = 44
const PLANET_CY = GROUND_Y - PLANET_R

function planetY(x: number, z: number): number {
  const r2 = x * x + z * z
  return PLANET_CY + Math.sqrt(Math.max(0, PLANET_R * PLANET_R - r2))
}

const tmpObj = new THREE.Object3D()
const tmpColor = new THREE.Color()

// Uniform sample across the field disc — the table sits in the meadow, grass
// (and tufts/clover/flowers) grow everywhere, including underneath it.
function scatter(): [number, number] {
  const r = Math.sqrt(Math.random()) * FIELD_RADIUS
  const a = Math.random() * Math.PI * 2
  return [Math.cos(a) * r, Math.sin(a) * r]
}

// ---- A small clump of soft, rounded blades fanning out from a shared base. ----
function makeTuftGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []
  const n = 7
  for (let i = 0; i < n; i++) {
    const h = 0.17 + ((i * 3) % 5) * 0.03
    const blade = new THREE.ConeGeometry(0.016, h, 6, 1)
    blade.translate(0, h / 2, 0) // base at origin
    const ang = (i / n) * Math.PI * 2 + i * 0.6
    const tilt = 0.1 + (i % 3) * 0.12
    const off = 0.03
    const m = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(tilt, ang, 0))
    m.setPosition(Math.cos(ang) * off, 0, Math.sin(ang) * off)
    blade.applyMatrix4(m)
    parts.push(blade)
  }
  const g = mergeGeometries(parts, false)!
  g.computeVertexNormals()
  return g
}

// ---- A three-leaf clover: rounded, slightly domed leaves on a short stem. ----
function makeCloverGeometry(): THREE.BufferGeometry {
  const parts: THREE.BufferGeometry[] = []
  for (let i = 0; i < 3; i++) {
    const leaf = new THREE.SphereGeometry(0.06, 10, 8)
    leaf.scale(1, 0.45, 1.15)
    const ang = (i / 3) * Math.PI * 2
    const off = 0.058
    leaf.applyMatrix4(
      new THREE.Matrix4().makeTranslation(Math.cos(ang) * off, 0.12, Math.sin(ang) * off)
    )
    parts.push(leaf)
  }
  const stem = new THREE.CylinderGeometry(0.008, 0.01, 0.13, 6)
  stem.translate(0, 0.065, 0)
  parts.push(stem)
  const g = mergeGeometries(parts, false)!
  g.computeVertexNormals()
  return g
}

function GrassTufts() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const geo = useMemo(makeTuftGeometry, [])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    for (let i = 0; i < TUFT_COUNT; i++) {
      const [x, z] = scatter()
      const s = 0.8 + Math.random() * 0.7
      tmpObj.position.set(x, planetY(x, z), z)
      tmpObj.rotation.set(0, Math.random() * Math.PI, 0)
      tmpObj.scale.set(s * (0.9 + Math.random() * 0.25), s, s * (0.9 + Math.random() * 0.25))
      tmpObj.updateMatrix()
      mesh.setMatrixAt(i, tmpObj.matrix)
      const tint = 0.9 + Math.random() * 0.22
      tmpColor.setRGB(0.46 * tint, 0.74 * tint, 0.26 * tint)
      mesh.setColorAt(i, tmpColor)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [geo])

  return (
    <instancedMesh ref={ref} args={[geo, undefined, TUFT_COUNT]} castShadow receiveShadow frustumCulled={false} raycast={() => null}>
      <meshStandardMaterial
        ref={(m: THREE.MeshStandardMaterial | null) => { if (m) disableOutline(m) }}
        color="#ffffff"
        roughness={1}
        metalness={0}
        emissive="#5f9e34"
        emissiveIntensity={0.14}
      />
    </instancedMesh>
  )
}

function Clovers() {
  const ref = useRef<THREE.InstancedMesh>(null)
  const geo = useMemo(makeCloverGeometry, [])

  useEffect(() => {
    const mesh = ref.current
    if (!mesh) return
    for (let i = 0; i < CLOVER_COUNT; i++) {
      const [x, z] = scatter()
      const s = 0.75 + Math.random() * 0.6
      tmpObj.position.set(x, planetY(x, z), z)
      tmpObj.rotation.set(0, Math.random() * Math.PI, 0)
      tmpObj.scale.setScalar(s)
      tmpObj.updateMatrix()
      mesh.setMatrixAt(i, tmpObj.matrix)
      const tint = 0.9 + Math.random() * 0.2
      tmpColor.setRGB(0.4 * tint, 0.68 * tint, 0.24 * tint)
      mesh.setColorAt(i, tmpColor)
    }
    mesh.instanceMatrix.needsUpdate = true
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true
  }, [geo])

  return (
    <instancedMesh ref={ref} args={[geo, undefined, CLOVER_COUNT]} castShadow receiveShadow frustumCulled={false} raycast={() => null}>
      <meshStandardMaterial
        ref={(m: THREE.MeshStandardMaterial | null) => { if (m) disableOutline(m) }}
        color="#ffffff"
        roughness={1}
        metalness={0}
        emissive="#4f8f2c"
        emissiveIntensity={0.14}
      />
    </instancedMesh>
  )
}

// Small flowers: a thin green stem, a colored head, and a tiny yellow center.
const PETAL_PALETTE = ['#fdfbf3', '#ffffff', '#f4d24a', '#b89be0', '#efa6c2']

function Flowers() {
  const stemRef = useRef<THREE.InstancedMesh>(null)
  const headRef = useRef<THREE.InstancedMesh>(null)
  const coreRef = useRef<THREE.InstancedMesh>(null)

  useEffect(() => {
    const stem = stemRef.current
    const head = headRef.current
    const core = coreRef.current
    if (!stem || !head || !core) return
    for (let i = 0; i < FLOWER_COUNT; i++) {
      const [x, z] = scatter()
      const s = 0.85 + Math.random() * 0.6
      const gy = planetY(x, z)
      const ry = Math.random() * Math.PI

      tmpObj.position.set(x, gy, z)
      tmpObj.rotation.set(0, ry, 0)
      tmpObj.scale.setScalar(s)
      tmpObj.updateMatrix()
      stem.setMatrixAt(i, tmpObj.matrix)

      tmpObj.position.set(x, gy + 0.26 * s, z)
      tmpObj.scale.setScalar(s)
      tmpObj.updateMatrix()
      head.setMatrixAt(i, tmpObj.matrix)
      tmpColor.set(PETAL_PALETTE[(Math.random() * PETAL_PALETTE.length) | 0])
      head.setColorAt(i, tmpColor)

      tmpObj.position.set(x, gy + 0.29 * s, z)
      tmpObj.scale.setScalar(s)
      tmpObj.updateMatrix()
      core.setMatrixAt(i, tmpObj.matrix)
    }
    stem.instanceMatrix.needsUpdate = true
    head.instanceMatrix.needsUpdate = true
    core.instanceMatrix.needsUpdate = true
    if (head.instanceColor) head.instanceColor.needsUpdate = true
  }, [])

  return (
    <group>
      <instancedMesh ref={stemRef} args={[undefined, undefined, FLOWER_COUNT]} frustumCulled={false} raycast={() => null}>
        <cylinderGeometry args={[0.008, 0.01, 0.26, 6]} />
        <meshStandardMaterial
          ref={(m: THREE.MeshStandardMaterial | null) => { if (m) disableOutline(m) }}
          color="#6aa83c"
          roughness={1}
          metalness={0}
        />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[undefined, undefined, FLOWER_COUNT]} frustumCulled={false} raycast={() => null}>
        <icosahedronGeometry args={[0.05, 2]} />
        <meshStandardMaterial
          ref={(m: THREE.MeshStandardMaterial | null) => { if (m) disableOutline(m) }}
          color="#ffffff"
          roughness={0.85}
          metalness={0}
          emissive="#ffffff"
          emissiveIntensity={0.18}
        />
      </instancedMesh>
      <instancedMesh ref={coreRef} args={[undefined, undefined, FLOWER_COUNT]} frustumCulled={false} raycast={() => null}>
        <icosahedronGeometry args={[0.022, 1]} />
        <meshStandardMaterial
          ref={(m: THREE.MeshStandardMaterial | null) => { if (m) disableOutline(m) }}
          color="#f3c33e"
          roughness={0.8}
          metalness={0}
          emissive="#f3c33e"
          emissiveIntensity={0.2}
        />
      </instancedMesh>
    </group>
  )
}

export function GrassField() {
  const matRef = useRef<THREE.MeshStandardMaterial | null>(null)
  const isDayMode = useSceneStore((s) => s.isDayMode)

  useEffect(() => {
    if (!matRef.current) return
    const p = paletteFor(isDayMode)
    const c = new THREE.Color(p.grassTint).multiplyScalar(0.95)
    const proxy = { r: matRef.current.color.r, g: matRef.current.color.g, b: matRef.current.color.b }
    gsap.to(proxy, {
      r: c.r,
      g: c.g,
      b: c.b,
      duration: 1.5,
      onUpdate: () => matRef.current?.color.setRGB(proxy.r, proxy.g, proxy.b),
    })
  }, [isDayMode])

  return (
    <group>
      {/* Smooth matte clay dome — the bright-green meadow surface. */}
      <mesh position-y={PLANET_CY} receiveShadow>
        <sphereGeometry args={[PLANET_R, 128, 128]} />
        <meshStandardMaterial
          ref={(m: THREE.MeshStandardMaterial | null) => {
            if (m) {
              matRef.current = m
              disableOutline(m)
            }
          }}
          color="#83c84d"
          roughness={1}
          metalness={0}
          emissive="#6aa83c"
          emissiveIntensity={0.12}
        />
      </mesh>
      <GrassTufts />
      <Clovers />
      <Flowers />
    </group>
  )
}
