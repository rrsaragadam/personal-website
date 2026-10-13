'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoundedBox } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { LIVERIES } from '@/features/livery/liveries'
import { useLivery } from '@/features/livery/useLivery'
import { materials } from './materials'
import { Knob } from './Knob'
import { Gauge } from './Gauge'
import { Screen } from './Screen'
import { Toggle } from './Toggle'
import { KeyFob } from './KeyFob'
import { Engraving } from './Engraving'
import { LANDSCAPE, PORTRAIT } from './layout'
import { ITEM_COUNT, SECTIONS, useConsole } from './useConsole'
import { useIgnition } from './useIgnition'

// The whole site: a milled aluminium console in the spirit of the Ferrari
// Luce centre panel. Toggles choose a section, the big knob browses it, the
// screen shows it, the small knob repaints everything, and the glass key
// brings up contact details.
export function Console() {
  const m = materials()
  const group = useRef<THREE.Group>(null)
  const pointer = useRef({ x: 0, y: 0 })
  const { viewport } = useThree()
  const start = useIgnition((s) => s.start)

  const mode = useConsole((s) => s.mode)
  const index = useConsole((s) => s.index)
  const bumpedAt = useConsole((s) => s.bumpedAt)
  const setMode = useConsole((s) => s.setMode)
  const setIndex = useConsole((s) => s.setIndex)
  const livery = useLivery((s) => s.livery)
  const setLivery = useLivery((s) => s.setLivery)

  const L = viewport.aspect > 1 ? LANDSCAPE : PORTRAIT
  const [pw, pd] = L.panel

  useEffect(() => {
    const t = setTimeout(start, 350)
    // Parallax follows a mouse only; on touch it would lurch with every tap.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('pointermove', onMove)
    return () => {
      clearTimeout(t)
      window.removeEventListener('pointermove', onMove)
    }
  }, [start])

  useFrame((state, dt) => {
    const g = group.current
    if (!g) return
    // Fit the tilted panel to the viewport with a little air around it.
    const projectedDepth = pd * Math.sin(L.tilt) + 0.3
    const portrait = viewport.aspect <= 1
    const scale = Math.min(
      (viewport.width * (portrait ? 0.9 : 0.84)) / pw,
      (viewport.height * (portrait ? 0.86 : 0.76)) / projectedDepth
    )
    const k = 1 - Math.exp(-dt * 5)
    const t = state.clock.elapsedTime
    g.scale.setScalar(scale)
    g.position.set(0, -viewport.height * 0.02 + Math.sin(t * 0.8) * 0.015, 0)
    g.rotation.x += (L.tilt + pointer.current.y * 0.04 - g.rotation.x) * k
    g.rotation.y += (pointer.current.x * 0.06 - g.rotation.y) * k
  })

  return (
    <group ref={group}>
      <RoundedBox
        args={[pw, 0.2, pd]}
        radius={0.1}
        smoothness={6}
        position-y={-0.1}
        material={m.aluminium}
      />

      <Screen position={L.screen.pos} size={L.screen.size} px={L.screen.px} />

      <Knob
        position={L.selector.pos}
        radius={L.selector.radius}
        count={ITEM_COUNT[mode]}
        value={index}
        onSelect={setIndex}
        bumpedAt={bumpedAt}
      />
      <Engraving text="Select" position={L.selector.label} />

      <Gauge position={L.gauge.pos} radius={L.gauge.radius} />

      <Knob
        position={L.finish.pos}
        radius={L.finish.radius}
        count={LIVERIES.length}
        step={(Math.PI * 2) / LIVERIES.length}
        value={LIVERIES.indexOf(livery)}
        onSelect={(i) => setLivery(LIVERIES[i].id)}
        jewels={LIVERIES.map((l) => l.paint)}
      />
      <Engraving text="Finish" position={L.finish.label} />

      {SECTIONS.map((s, i) => (
        <Toggle
          key={s.mode}
          label={s.label}
          position={L.toggles[i]}
          on={mode === s.mode}
          onFlip={() => setMode(s.mode)}
        />
      ))}

      <KeyFob position={L.key.pos} rotation-y={L.key.rotation} />
    </group>
  )
}
