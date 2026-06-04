'use client'

import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'

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

function CloudCluster({
  position,
  scale = 1,
}: {
  position: [number, number, number]
  scale?: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const isDayMode = useSceneStore((s) => s.isDayMode)

  useEffect(() => {
    if (!groupRef.current) return
    groupRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const mat = child.material as THREE.MeshLambertMaterial
        gsap.to(mat, { opacity: isDayMode ? 0.88 : 0.12, duration: 1.5 })
      }
    })
  }, [isDayMode])

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[1.5, 8, 6]} />
        <meshLambertMaterial color="white" transparent opacity={0.88} />
      </mesh>
      <mesh position={[1.6, -0.3, 0.4]}>
        <sphereGeometry args={[1.1, 8, 6]} />
        <meshLambertMaterial color="white" transparent opacity={0.88} />
      </mesh>
      <mesh position={[-1.6, -0.2, -0.3]}>
        <sphereGeometry args={[1.0, 8, 6]} />
        <meshLambertMaterial color="white" transparent opacity={0.88} />
      </mesh>
      <mesh position={[0.4, 0.6, -0.5]}>
        <sphereGeometry args={[0.9, 8, 6]} />
        <meshLambertMaterial color="white" transparent opacity={0.88} />
      </mesh>
    </group>
  )
}

export function SceneEnvironment() {
  const { scene } = useThree()
  const isDayMode = useSceneStore((s) => s.isDayMode)

  useEffect(() => {
    scene.background = new THREE.Color('#87ceeb')
    scene.fog = new THREE.Fog('#c8e8ff', 22, 62)
    return () => {
      scene.background = null
      scene.fog = null
    }
  }, [scene])

  useEffect(() => {
    if (!scene.background || !scene.fog) return

    const bg = scene.background as THREE.Color
    const fog = scene.fog as THREE.Fog

    const bgProxy = { r: bg.r, g: bg.g, b: bg.b }
    const bgTo = isDayMode
      ? { r: 0.529, g: 0.808, b: 0.922 }
      : { r: 0.02, g: 0.05, b: 0.118 }
    gsap.to(bgProxy, {
      ...bgTo,
      duration: 1.5,
      onUpdate: () => bg.setRGB(bgProxy.r, bgProxy.g, bgProxy.b),
    })

    const fogProxy = { r: fog.color.r, g: fog.color.g, b: fog.color.b }
    const fogTo = isDayMode
      ? { r: 0.784, g: 0.91, b: 1.0 }
      : { r: 0.031, g: 0.059, b: 0.11 }
    gsap.to(fogProxy, {
      ...fogTo,
      duration: 1.5,
      onUpdate: () => fog.color.setRGB(fogProxy.r, fogProxy.g, fogProxy.b),
    })

    const fogRange = { near: fog.near, far: fog.far }
    const fogRangeTo = isDayMode ? { near: 22, far: 62 } : { near: 16, far: 46 }
    gsap.to(fogRange, {
      ...fogRangeTo,
      duration: 1.5,
      onUpdate: () => {
        fog.near = fogRange.near
        fog.far = fogRange.far
      },
    })
  }, [isDayMode, scene])

  return (
    <>
      {/* Ground */}
      <mesh rotation-x={-Math.PI / 2} position-y={-0.825} receiveShadow>
        <planeGeometry args={[120, 120]} />
        <meshLambertMaterial color="#5a8a5e" />
      </mesh>

      <StarField />

      {/* Cloud clusters */}
      <CloudCluster position={[-10, 8, -18]} scale={1.4} />
      <CloudCluster position={[8, 9, -22]} scale={1.1} />
      <CloudCluster position={[16, 7.5, -14]} scale={1.2} />
      <CloudCluster position={[-3, 10, -28]} scale={1.8} />
    </>
  )
}
