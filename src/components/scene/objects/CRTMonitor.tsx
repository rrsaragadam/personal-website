'use client'

import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'

const FRAME_COLOR = '#c8b878'
const FRAME_DARK = '#a89050'
const BODY_COLOR = '#d4c88a'

export function CRTMonitor() {
  const bodyRef = useRef<THREE.Group>(null)
  const meshRefs = useRef<THREE.Mesh[]>([])
  const { isTransitioning, setActiveObject } = useSceneStore()

  const handlePointerEnter = useCallback(() => {
    document.body.style.cursor = 'pointer'
    meshRefs.current.forEach((m) => {
      if (m?.material) {
        gsap.to(m.material as THREE.MeshStandardMaterial, {
          emissiveIntensity: 0.15,
          duration: 0.2,
        })
      }
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    document.body.style.cursor = 'auto'
    meshRefs.current.forEach((m) => {
      if (m?.material) {
        gsap.to(m.material as THREE.MeshStandardMaterial, {
          emissiveIntensity: 0,
          duration: 0.2,
        })
      }
    })
  }, [])

  const handleClick = useCallback(() => {
    if (!isTransitioning) setActiveObject('monitor')
  }, [isTransitioning, setActiveObject])

  const addRef = (el: THREE.Mesh | null, i: number) => {
    if (el) meshRefs.current[i] = el
  }

  return (
    <group
      ref={bodyRef}
      position={[0.5, 0.075, -0.65]}
      rotation-y={-0.1}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {/* CRT body */}
      <mesh ref={(el) => addRef(el, 0)} castShadow receiveShadow>
        <boxGeometry args={[1.18, 0.98, 0.72]} />
        <meshStandardMaterial
          color={BODY_COLOR}
          roughness={0.65}
          metalness={0.05}
          emissive={BODY_COLOR}
          emissiveIntensity={0}
        />
      </mesh>

      {/* Ornate outer frame — top */}
      <mesh ref={(el) => addRef(el, 1)} position={[0, 0.56, 0.18]} castShadow>
        <boxGeometry args={[1.38, 0.14, 0.36]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.3} metalness={0.5} emissive={FRAME_COLOR} emissiveIntensity={0} />
      </mesh>
      {/* bottom */}
      <mesh ref={(el) => addRef(el, 2)} position={[0, -0.56, 0.18]} castShadow>
        <boxGeometry args={[1.38, 0.14, 0.36]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.3} metalness={0.5} emissive={FRAME_COLOR} emissiveIntensity={0} />
      </mesh>
      {/* left */}
      <mesh ref={(el) => addRef(el, 3)} position={[-0.69, 0, 0.18]} castShadow>
        <boxGeometry args={[0.14, 1.26, 0.36]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.3} metalness={0.5} emissive={FRAME_COLOR} emissiveIntensity={0} />
      </mesh>
      {/* right */}
      <mesh ref={(el) => addRef(el, 4)} position={[0.69, 0, 0.18]} castShadow>
        <boxGeometry args={[0.14, 1.26, 0.36]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.3} metalness={0.5} emissive={FRAME_COLOR} emissiveIntensity={0} />
      </mesh>

      {/* Frame corner ornaments */}
      {[[-0.69, 0.56], [0.69, 0.56], [-0.69, -0.56], [0.69, -0.56]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.18]} castShadow>
          <boxGeometry args={[0.14, 0.14, 0.38]} />
          <meshStandardMaterial color={FRAME_DARK} roughness={0.25} metalness={0.6} />
        </mesh>
      ))}

      {/* Screen bezel */}
      <mesh position={[0, 0, 0.365]}>
        <boxGeometry args={[0.92, 0.76, 0.01]} />
        <meshStandardMaterial color="#1a1510" roughness={0.5} />
      </mesh>

      {/* Screen face */}
      <mesh position={[0, 0, 0.372]}>
        <boxGeometry args={[0.86, 0.7, 0.001]} />
        <meshStandardMaterial
          color="#080808"
          emissive="#080810"
          emissiveIntensity={0.4}
          roughness={0.05}
        />
      </mesh>

      {/* Screen content */}
      <Html transform position={[0, 0, 0.375]} scale={[0.07, 0.07, 0.07]}>
        <div className="pointer-events-none flex h-[340px] w-[420px] items-center justify-center bg-[#080808]">
          <p className="font-sans text-[11px] tracking-widest text-white/20 uppercase">
            Work Experience
          </p>
        </div>
      </Html>

      {/* Stand base */}
      <mesh position={[0, -0.65, 0.15]} castShadow receiveShadow>
        <boxGeometry args={[0.45, 0.06, 0.3]} />
        <meshStandardMaterial color={FRAME_DARK} roughness={0.4} metalness={0.4} />
      </mesh>
    </group>
  )
}
