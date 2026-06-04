'use client'

import { useCallback, useMemo, useEffect, type ReactNode } from 'react'
import { type ThreeEvent } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useSceneStore, type SceneObject } from '@/store/useSceneStore'
import { useModel, collectHoverMaterials, type FitOptions } from '@/lib/useModel'

interface ModelObjectProps {
  url: string
  fit: FitOptions
  position: [number, number, number]
  rotation?: [number, number, number]
  // When set, the object is clickable and opens that panel; omit for decor.
  target?: Exclude<SceneObject, null>
  hoverIntensity?: number
  children?: ReactNode
}

// Generic GLTF desk object: loads + auto-fits a model, restores the existing
// hover-glow + click-to-zoom contract, and lets callers slot a screen overlay.
export function ModelObject({
  url,
  fit,
  position,
  rotation = [0, 0, 0],
  target,
  hoverIntensity = 0.18,
  children,
}: ModelObjectProps) {
  const model = useModel(url, { ...fit, rotation })
  const mats = useMemo(() => collectHoverMaterials(model), [model])
  const isTransitioning = useSceneStore((s) => s.isTransitioning)
  const setActiveObject = useSceneStore((s) => s.setActiveObject)

  // Reset cursor if unmounted mid-hover.
  useEffect(() => () => void (document.body.style.cursor = 'auto'), [])

  // stopPropagation makes hover/click occlusion-aware: r3f dispatches to hit
  // objects nearest-first, so stopping here means a closer object (e.g. the
  // laptop) wins and the one behind it (the monitor) is never highlighted.
  const handlePointerOver = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!target) return
      e.stopPropagation()
      document.body.style.cursor = 'pointer'
      mats.forEach((m) =>
        gsap.to(m, { emissiveIntensity: hoverIntensity, duration: 0.2 })
      )
    },
    [mats, target, hoverIntensity]
  )

  const handlePointerOut = useCallback(
    (e: ThreeEvent<PointerEvent>) => {
      if (!target) return
      e.stopPropagation()
      document.body.style.cursor = 'auto'
      mats.forEach((m) => gsap.to(m, { emissiveIntensity: 0, duration: 0.2 }))
    },
    [mats, target]
  )

  const handleClick = useCallback(
    (e: ThreeEvent<MouseEvent>) => {
      if (!target || isTransitioning) return
      e.stopPropagation()
      setActiveObject(target)
    },
    [target, isTransitioning, setActiveObject]
  )

  return (
    <group
      position={position}
      onPointerOver={target ? handlePointerOver : undefined}
      onPointerOut={target ? handlePointerOut : undefined}
      onClick={target ? handleClick : undefined}
    >
      <primitive object={model} />
      {children}
    </group>
  )
}
