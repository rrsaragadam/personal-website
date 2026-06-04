'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'

export function Lighting() {
  const ambientRef = useRef<THREE.AmbientLight>(null)
  const sunRef = useRef<THREE.DirectionalLight>(null)
  const isDayMode = useSceneStore((s) => s.isDayMode)

  useEffect(() => {
    const ambient = ambientRef.current
    const sun = sunRef.current
    if (!ambient || !sun) return

    gsap.to(ambient, { intensity: isDayMode ? 0.6 : 0.15, duration: 1.5 })
    gsap.to(sun, { intensity: isDayMode ? 2.5 : 0.3, duration: 1.5 })

    const ambProxy = { r: ambient.color.r, g: ambient.color.g, b: ambient.color.b }
    const ambTo = isDayMode
      ? { r: 1.0, g: 0.976, b: 0.902 }
      : { r: 0.165, g: 0.227, b: 0.333 }
    gsap.to(ambProxy, {
      ...ambTo,
      duration: 1.5,
      onUpdate: () => ambient.color.setRGB(ambProxy.r, ambProxy.g, ambProxy.b),
    })

    const sunProxy = { r: sun.color.r, g: sun.color.g, b: sun.color.b }
    const sunTo = isDayMode
      ? { r: 1.0, g: 0.984, b: 0.91 }
      : { r: 0.533, g: 0.6, b: 0.733 }
    gsap.to(sunProxy, {
      ...sunTo,
      duration: 1.5,
      onUpdate: () => sun.color.setRGB(sunProxy.r, sunProxy.g, sunProxy.b),
    })

    gsap.to(sun.position, {
      x: isDayMode ? 10 : -5,
      y: isDayMode ? 20 : 15,
      z: isDayMode ? 10 : 8,
      duration: 1.5,
    })
  }, [isDayMode])

  return (
    <>
      <ambientLight ref={ambientRef} intensity={0.6} color="#fff9e6" />
      <directionalLight
        ref={sunRef}
        intensity={2.5}
        color="#fffbe8"
        position={[10, 20, 10]}
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
