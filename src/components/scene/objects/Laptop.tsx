'use client'

import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'

const ALUMINUM = '#b8bcc4'
const SCREEN_BG = '#0a0e1a'

export function Laptop() {
  const baseRef = useRef<THREE.Mesh>(null)
  const screenRef = useRef<THREE.Mesh>(null)
  const { isTransitioning, setActiveObject } = useSceneStore()

  const handlePointerEnter = useCallback(() => {
    document.body.style.cursor = 'pointer'
    ;[baseRef, screenRef].forEach((r) => {
      if (r.current?.material) {
        gsap.to(r.current.material as THREE.MeshStandardMaterial, {
          emissiveIntensity: 0.18,
          duration: 0.2,
        })
      }
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    document.body.style.cursor = 'auto'
    ;[baseRef, screenRef].forEach((r) => {
      if (r.current?.material) {
        gsap.to(r.current.material as THREE.MeshStandardMaterial, {
          emissiveIntensity: 0,
          duration: 0.2,
        })
      }
    })
  }, [])

  const handleClick = useCallback(() => {
    if (!isTransitioning) setActiveObject('laptop')
  }, [isTransitioning, setActiveObject])

  const OPEN_ANGLE = -(110 * Math.PI) / 180

  return (
    <group
      position={[-0.5, 0, 0.38]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* Base */}
      <mesh ref={baseRef} position={[0, 0.109, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.22, 0.065, 0.88]} />
        <meshStandardMaterial
          color={ALUMINUM}
          roughness={0.2}
          metalness={0.85}
          emissive={ALUMINUM}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Keyboard area recess */}
      <mesh position={[0, 0.143, 0.04]}>
        <boxGeometry args={[1.0, 0.005, 0.62]} />
        <meshStandardMaterial color="#9099a4" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Touchpad */}
      <mesh position={[0, 0.143, 0.28]}>
        <boxGeometry args={[0.32, 0.004, 0.2]} />
        <meshStandardMaterial color="#a0a8b4" roughness={0.15} metalness={0.7} />
      </mesh>

      {/* Screen assembly — hinge at back of base top */}
      <group position={[0, 0.142, -0.44]} rotation-x={OPEN_ANGLE}>
        <group position={[0, 0.4, 0]}>
          {/* Screen housing */}
          <mesh ref={screenRef} castShadow>
            <boxGeometry args={[1.22, 0.8, 0.055]} />
            <meshStandardMaterial
              color={ALUMINUM}
              roughness={0.2}
              metalness={0.85}
              emissive={ALUMINUM}
              emissiveIntensity={0}
            />
          </mesh>

          {/* Screen bezel */}
          <mesh position={[0, 0, 0.029]}>
            <boxGeometry args={[1.14, 0.72, 0.005]} />
            <meshStandardMaterial color="#111318" roughness={0.4} metalness={0.3} />
          </mesh>

          {/* Screen face — glowing */}
          <mesh position={[0, 0, 0.034]}>
            <boxGeometry args={[1.08, 0.66, 0.001]} />
            <meshStandardMaterial
              color={SCREEN_BG}
              emissive="#0a1535"
              emissiveIntensity={0.8}
              roughness={0.05}
              metalness={0.0}
            />
          </mesh>

          {/* Screen content */}
          <Html
            transform
            position={[0, 0.01, 0.036]}
            scale={[0.074, 0.074, 0.074]}
          >
            <div className="pointer-events-none flex h-[300px] w-[520px] flex-col items-start justify-center bg-[#0a0e1a] px-10">
              <p className="mb-1 font-sans text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
                hi, i&apos;m rishi
              </p>
              <h1 className="font-display text-[42px] leading-[1.1] text-white">
                product
                <br />
                designer
              </h1>
              <div className="mt-3 h-px w-12 bg-white/20" />
            </div>
          </Html>
        </group>
      </group>
    </group>
  )
}
