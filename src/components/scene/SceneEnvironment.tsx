'use client'

import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { Clouds, Cloud } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'
import { paletteFor, rgbOf } from '@/lib/sceneConfig'
import { disableOutline } from '@/lib/toon'
import { GradientSky } from './sky/GradientSky'
import { GrassField } from './environment/GrassField'
import { Rocks } from './environment/Rocks'

function StarField() {
  const matRef = useRef<THREE.PointsMaterial>(null)
  const isDayMode = useSceneStore((s) => s.isDayMode)

  const geo = useMemo(() => {
    const positions = new Float32Array(3000 * 3)
    for (let i = 0; i < 3000; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 55 + Math.random() * 15
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = Math.abs(r * Math.cos(phi)) + 2
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta)
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [])

  useEffect(() => {
    if (!matRef.current) return
    gsap.to(matRef.current, { opacity: isDayMode ? 0 : 1, duration: 1.5 })
  }, [isDayMode])

  return (
    <points geometry={geo}>
      <pointsMaterial
        ref={matRef}
        size={0.18}
        color="#ffffff"
        transparent
        opacity={0}
        sizeAttenuation
      />
    </points>
  )
}

// Soft radial-gradient glow billboard for the moon (night only).
function MoonGlow() {
  const matRef = useRef<THREE.SpriteMaterial>(null)
  const isDayMode = useSceneStore((s) => s.isDayMode)

  const texture = useMemo(() => {
    const size = 128
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = size
    const ctx = canvas.getContext('2d')!
    const grad = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    grad.addColorStop(0, 'rgba(255,255,255,1)')
    grad.addColorStop(0.25, 'rgba(207,216,255,0.9)')
    grad.addColorStop(1, 'rgba(207,216,255,0)')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(canvas)
  }, [])

  useEffect(() => {
    if (!matRef.current) return
    gsap.to(matRef.current, { opacity: isDayMode ? 0 : 0.9, duration: 1.5 })
  }, [isDayMode])

  return (
    <sprite position={[-14, 16, -34]} scale={[14, 14, 1]}>
      <spriteMaterial
        ref={matRef}
        map={texture}
        transparent
        opacity={0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </sprite>
  )
}

function CloudLayer() {
  const groupRef = useRef<THREE.Group>(null)
  const isDayMode = useSceneStore((s) => s.isDayMode)

  // Clouds are clusters of small meshes; keep the global OutlineEffect off them
  // so they stay soft puffs instead of ink-edged blobs.
  useEffect(() => {
    groupRef.current?.traverse((child) => {
      const mat = (child as THREE.Mesh).material as THREE.Material | undefined
      if (mat) disableOutline(mat)
    })
  }, [])

  useEffect(() => {
    if (!groupRef.current) return
    // Tween the shared cloud material opacity by traversing the group.
    const current = { o: isDayMode ? 0.1 : 1 }
    gsap.to(current, {
      o: isDayMode ? 1 : 0.1,
      duration: 1.5,
      onUpdate: () => {
        groupRef.current?.traverse((child) => {
          const mat = (child as THREE.Mesh).material as
            | (THREE.Material & { opacity: number; transparent: boolean })
            | undefined
          if (mat) {
            mat.transparent = true
            mat.opacity = current.o
          }
        })
      },
    })
  }, [isDayMode])

  return (
    <group ref={groupRef}>
      <Clouds material={THREE.MeshLambertMaterial} limit={700}>
        <Cloud seed={1} position={[-9, 7.2, -15]} bounds={[7, 2.4, 3.5]} volume={13} opacity={1} speed={0.1} color="#ffffff" />
        <Cloud seed={2} position={[8, 8.2, -17]} bounds={[7, 2.3, 3.5]} volume={12} opacity={1} speed={0.09} color="#ffffff" />
        <Cloud seed={3} position={[15, 6.2, -13]} bounds={[5.5, 2, 3]} volume={9} opacity={1} speed={0.12} color="#fdfdff" />
        <Cloud seed={4} position={[-2, 9.2, -21]} bounds={[9, 2.6, 4.5]} volume={15} opacity={1} speed={0.07} color="#ffffff" />
        <Cloud seed={5} position={[3, 5.6, -11]} bounds={[5, 1.8, 3]} volume={8} opacity={0.97} speed={0.13} color="#ffffff" />
        <Cloud seed={6} position={[-14, 9.5, -20]} bounds={[6, 2.1, 3.5]} volume={10} opacity={1} speed={0.08} color="#ffffff" />
        <Cloud seed={7} position={[12, 10, -23]} bounds={[7, 2.2, 4]} volume={11} opacity={1} speed={0.06} color="#fdfdff" />
      </Clouds>
    </group>
  )
}

export function SceneEnvironment() {
  const { scene } = useThree()
  const isDayMode = useSceneStore((s) => s.isDayMode)

  useEffect(() => {
    const p = paletteFor(true)
    // No scene.background — the GradientSky mesh provides the backdrop.
    scene.fog = new THREE.Fog(p.skyBottom, p.fogNear, p.fogFar)
    return () => {
      scene.fog = null
    }
  }, [scene])

  useEffect(() => {
    if (!scene.fog) return
    const fog = scene.fog as THREE.Fog
    const p = paletteFor(isDayMode)

    // Fog color tracks the sky's horizon color so there is no hard seam.
    const fogTo = rgbOf(p.skyBottom)
    const fogProxy = { r: fog.color.r, g: fog.color.g, b: fog.color.b }
    gsap.to(fogProxy, {
      ...fogTo,
      duration: 1.5,
      onUpdate: () => fog.color.setRGB(fogProxy.r, fogProxy.g, fogProxy.b),
    })

    const fogRange = { near: fog.near, far: fog.far }
    gsap.to(fogRange, {
      near: p.fogNear,
      far: p.fogFar,
      duration: 1.5,
      onUpdate: () => {
        fog.near = fogRange.near
        fog.far = fogRange.far
      },
    })
  }, [isDayMode, scene])

  return (
    <>
      <GradientSky />
      <GrassField />
      <Rocks />
      <StarField />
      <MoonGlow />
      <CloudLayer />
    </>
  )
}
