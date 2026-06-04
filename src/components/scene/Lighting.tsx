'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'
import { DAY, paletteFor, rgbOf } from '@/lib/sceneConfig'

export function Lighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const isDayMode = useSceneStore((s) => s.isDayMode)

  useEffect(() => {
    const ambient = ambientRef.current
    const sun = sunRef.current
    if (!ambient || !sun) return
    const p = paletteFor(isDayMode)

    gsap.to(ambient, { intensity: p.ambientIntensity, duration: 1.5 })
    gsap.to(sun, { intensity: p.sunIntensity, duration: 1.5 })

    const ambTo = rgbOf(p.ambientColor)
    const ambProxy = { r: ambient.color.r, g: ambient.color.g, b: ambient.color.b }
    gsap.to(ambProxy, {
      ...ambTo,
      duration: 1.5,
      onUpdate: () => ambient.color.setRGB(ambProxy.r, ambProxy.g, ambProxy.b),
    })

    const sunTo = rgbOf(p.sunColor)
    const sunProxy = { r: sun.color.r, g: sun.color.g, b: sun.color.b }
    gsap.to(sunProxy, {
      ...sunTo,
      duration: 1.5,
      onUpdate: () => sun.color.setRGB(sunProxy.r, sunProxy.g, sunProxy.b),
    })

    gsap.to(sun.position, {
      x: p.sunPosition[0],
      y: p.sunPosition[1],
      z: p.sunPosition[2],
      duration: 1.5,
    })
  }, [isDayMode])

  return (
    <>
      {/* Soft sky/ground fill keeps shadows luminous and pastel — the airy meadow look. */}
      <hemisphereLight args={['#bfe6f5', '#9fd07a', 0.95]} />
      <ambientLight
        ref={ambientRef}
        intensity={DAY.ambientIntensity}
        color={DAY.ambientColor}
      />
      <directionalLight
        ref={sunRef}
        intensity={DAY.sunIntensity}
        color={DAY.sunColor}
        position={DAY.sunPosition}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-15}
        shadow-camera-right={15}
        shadow-camera-top={15}
        shadow-camera-bottom={-15}
      />
    </>
  )
}
