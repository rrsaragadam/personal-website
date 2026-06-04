'use client'

import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'

const ALUMINUM = '#b8bcc4'

export function IPad() {
  const bodyRef = useRef<THREE.Mesh>(null)
  const { isTransitioning, setActiveObject } = useSceneStore()

  const handlePointerEnter = useCallback(() => {
    document.body.style.cursor = 'pointer'
    if (bodyRef.current?.material) {
      gsap.to(bodyRef.current.material as THREE.MeshStandardMaterial, {
        emissiveIntensity: 0.18,
        duration: 0.2,
      })
    }
  }, [])

  const handlePointerLeave = useCallback(() => {
    document.body.style.cursor = 'auto'
    if (bodyRef.current?.material) {
      gsap.to(bodyRef.current.material as THREE.MeshStandardMaterial, {
        emissiveIntensity: 0,
        duration: 0.2,
      })
    }
  }, [])

  const handleClick = useCallback(() => {
    if (!isTransitioning) setActiveObject('ipad')
  }, [isTransitioning, setActiveObject])

  return (
    <group
      position={[2.1, 0.12, 0.05]}
      rotation-y={-0.15}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* Stand */}
      <mesh position={[0, -0.1, -0.22]} rotation-x={0.4} castShadow>
        <boxGeometry args={[0.42, 0.55, 0.025]} />
        <meshStandardMaterial color="#9099a4" roughness={0.4} metalness={0.6} />
      </mesh>
      <mesh position={[0, -0.38, -0.08]} rotation-x={1.1} castShadow>
        <boxGeometry args={[0.38, 0.24, 0.018]} />
        <meshStandardMaterial color="#9099a4" roughness={0.4} metalness={0.6} />
      </mesh>

      {/* iPad body */}
      <mesh ref={bodyRef} position={[0, 0.38, 0]} castShadow>
        <boxGeometry args={[0.68, 0.92, 0.048]} />
        <meshStandardMaterial
          color={ALUMINUM}
          roughness={0.2}
          metalness={0.85}
          emissive={ALUMINUM}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Bezel */}
      <mesh position={[0, 0.38, 0.025]}>
        <boxGeometry args={[0.62, 0.86, 0.002]} />
        <meshStandardMaterial color="#111318" roughness={0.4} />
      </mesh>

      {/* Screen face */}
      <mesh position={[0, 0.38, 0.027]}>
        <boxGeometry args={[0.58, 0.82, 0.001]} />
        <meshStandardMaterial
          color="#0a1020"
          emissive="#0a1535"
          emissiveIntensity={0.7}
          roughness={0.05}
        />
      </mesh>

      {/* Screen content */}
      <Html transform position={[0, 0.38, 0.03]} scale={[0.06, 0.06, 0.06]}>
        <div className="pointer-events-none flex h-[460px] w-[320px] flex-col bg-gradient-to-b from-[#0f1624] to-[#1a2640] p-5">
          <p className="mb-4 font-sans text-[9px] tracking-widest text-white/30 uppercase">
            Projects
          </p>
          {['Portfolio Website', 'Design System', 'Mobile App'].map((p) => (
            <div key={p} className="mb-3 rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400/70" />
              <p className="mt-1.5 font-sans text-[10px] font-medium text-white/80">{p}</p>
            </div>
          ))}
        </div>
      </Html>
    </group>
  )
}
