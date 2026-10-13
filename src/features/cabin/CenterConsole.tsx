'use client'

import { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Html, RoundedBox } from '@react-three/drei'
import { useFrame, type ThreeEvent } from '@react-three/fiber'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from '@/features/console/materials'
import { MONO, SANS, textTexture } from '@/features/console/textures'
import { useConsole } from '@/features/console/useConsole'
import { litAmount, useIgnition } from '@/features/console/useIgnition'
import { detent, ignition } from '@/features/console/detent'

const TOP = 0.68
const DOCK = new THREE.Vector3(0.38, TOP + 0.004, 0.0)
const REST = new THREE.Vector3(0.4, TOP + 0.012, 0.2)
const REST_YAW = 0.45
const KEY: [number, number] = [0.056, 0.092]

const ease = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2)

// E-ink face of the key. The logo is yellow until the key is docked, then
// flashes (as e-ink does when it refreshes) and settles to black.
type Ink = 'yellow' | 'flash' | 'black'
function drawInk(state: Ink) {
  return (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const flash = state === 'flash'
    ctx.fillStyle = flash ? '#1a1a1d' : '#dddcd6'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle =
      state === 'yellow' ? '#f6c616' : flash ? '#dddcd6' : '#161618'
    ctx.beginPath()
    ctx.arc(w / 2, h * 0.42, w * 0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = state === 'black' ? '#dddcd6' : '#161618'
    ctx.font = `600 ${w * 0.2}px ${SANS}`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('RS', w / 2, h * 0.425)
    ctx.fillStyle = flash ? 'rgba(221,220,214,0.6)' : 'rgba(22,22,24,0.55)'
    ctx.font = `500 ${w * 0.065}px ${MONO}`
    ctx.fillText(state === 'black' ? 'CONTACT' : 'START', w / 2, h * 0.82)
  }
}

// Laser-etched holes in the aluminium under the tunnel's glass, after the
// Luce's glass shifter.
function dotGrid() {
  return textTexture(256, 640, (ctx, w, h) => {
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, w, h)
    ctx.fillStyle = '#1a1a1e'
    for (let y = 16; y < h; y += 16)
      for (let x = 16; x < w; x += 16) {
        ctx.beginPath()
        ctx.arc(x, y, 1.6, 0, Math.PI * 2)
        ctx.fill()
      }
  })
}

// The glass key and the console it docks into. Dropping the key in is the
// start ritual; once docked, tapping it brings up contact details.
export function CenterConsole() {
  const m = materials()
  const livery = useLivery((s) => s.livery)
  const startedAt = useIgnition((s) => s.startedAt)
  const start = useIgnition((s) => s.start)
  const setMode = useConsole((s) => s.setMode)
  const key = useRef<THREE.Group>(null)
  const ring = useRef<THREE.MeshBasicMaterial>(null)
  const inkState = useRef<Ink>('yellow')
  const [hover, setHover] = useState(false)

  const ink = useMemo(() => textTexture(256, 420, drawInk('yellow')), [])
  const grid = useMemo(() => dotGrid(), [])
  const etched = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: '#5d6068',
        metalness: 1,
        roughness: 0.32,
        map: grid.tex,
      }),
    [grid]
  )

  const onClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (!startedAt) {
      ignition()
      start()
    } else {
      detent(1.2)
      setMode('contact')
    }
  }

  useFrame(() => {
    const g = key.current
    if (!g) return
    const t = startedAt ? (performance.now() - startedAt) / 1000 : 0
    const p = ease(Math.min(1, t / 0.7))
    g.position.lerpVectors(REST, DOCK, p)
    g.position.y += Math.sin(p * Math.PI) * 0.035
    if (!startedAt) g.position.y += hover ? 0.006 : 0
    g.rotation.y = REST_YAW * (1 - p)

    const next: Ink = t < 0.75 ? 'yellow' : t < 0.9 ? 'flash' : 'black'
    if (startedAt && next !== inkState.current) {
      inkState.current = next
      ink.repaint(drawInk(next))
    }
    ring.current?.color
      .set(livery.accent[0])
      .multiplyScalar(0.15 + litAmount(startedAt, 0.7) * 0.85)
  })

  return (
    <group>
      {/* Aluminium plate with etched holes, under a slab of glass */}
      <mesh
        position={[0.38, TOP + 0.001, 0.3]}
        rotation-x={-Math.PI / 2}
        material={etched}
      >
        <planeGeometry args={[0.18, 0.36]} />
      </mesh>
      <RoundedBox
        args={[0.19, 0.012, 0.37]}
        radius={0.005}
        position={[0.38, TOP + 0.007, 0.3]}
        material={m.glassSlab}
      />

      {/* The dock: a dark pocket with a ring that lights at start-up */}
      <RoundedBox
        args={[KEY[0] + 0.02, 0.01, KEY[1] + 0.02]}
        radius={0.004}
        position={[DOCK.x, TOP + 0.002, DOCK.z]}
        material={m.aluminiumPolished}
      />
      <mesh position={[DOCK.x, TOP + 0.0075, DOCK.z]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[KEY[0] + 0.006, KEY[1] + 0.006]} />
        <meshBasicMaterial color="#09090b" />
      </mesh>
      <mesh position={[DOCK.x, TOP + 0.0078, DOCK.z]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[0.052, 0.0545, 64]} />
        <meshBasicMaterial ref={ring} toneMapped={false} />
      </mesh>

      {/* The key: anodised base, e-ink face, glass top */}
      <group
        ref={key}
        onClick={onClick}
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
        <RoundedBox
          args={[KEY[0], 0.005, KEY[1]]}
          radius={0.002}
          position-y={0.0025}
          material={m.anodised}
        />
        <mesh position-y={0.0052} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[KEY[0] - 0.006, KEY[1] - 0.006]} />
          <meshBasicMaterial map={ink.tex} toneMapped={false} />
        </mesh>
        <RoundedBox
          args={[KEY[0], 0.007, KEY[1]]}
          radius={0.003}
          position-y={0.0085}
          material={m.glassSlab}
        />
        {!startedAt && (
          <Html position={[0, 0.07, 0]} center zIndexRange={[20, 10]}>
            <button
              onClick={() => {
                ignition()
                start()
              }}
              className="glass text-ink flex items-center gap-2 rounded-full px-3.5 py-1.5 font-mono text-[11px] tracking-[0.18em] whitespace-nowrap uppercase"
            >
              <span className="bg-accent size-1.5 animate-pulse rounded-full" />
              Dock the key to start
            </button>
          </Html>
        )}
      </group>
    </group>
  )
}
