'use client'

import { useRef, useCallback } from 'react'
import * as THREE from 'three'
import { Html } from '@react-three/drei'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'

const BOOK_CONFIGS = [
  { color: '#c8a96e', height: 0.16, width: 0.88, depth: 0.62, label: 'Bauhaus', offset: 0 },
  { color: '#4a7fa5', height: 0.15, width: 0.84, depth: 0.6, label: '', offset: 0.005 },
  { color: '#c84b3a', height: 0.17, width: 0.9, depth: 0.61, label: '', offset: -0.003 },
  { color: '#e8d5a3', height: 0.14, width: 0.82, depth: 0.59, label: '', offset: 0.004 },
]

export function Books() {
  const groupRef = useRef<THREE.Group>(null)
  const meshRefs = useRef<THREE.Mesh[]>([])
  const { isTransitioning, setActiveObject } = useSceneStore()

  const handlePointerEnter = useCallback(() => {
    document.body.style.cursor = 'pointer'
    meshRefs.current.forEach((mesh) => {
      if (mesh?.material) {
        gsap.to((mesh.material as THREE.MeshStandardMaterial), {
          emissiveIntensity: 0.2,
          duration: 0.2,
        })
      }
    })
  }, [])

  const handlePointerLeave = useCallback(() => {
    document.body.style.cursor = 'auto'
    meshRefs.current.forEach((mesh) => {
      if (mesh?.material) {
        gsap.to((mesh.material as THREE.MeshStandardMaterial), {
          emissiveIntensity: 0,
          duration: 0.2,
        })
      }
    })
  }, [])

  const handleClick = useCallback(() => {
    if (!isTransitioning) setActiveObject('books')
  }, [isTransitioning, setActiveObject])

  let stackY = 0.076

  return (
    <group
      ref={groupRef}
      position={[-2.4, 0, 0.25]}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={handleClick}
    >
      {BOOK_CONFIGS.map((book, i) => {
        const bookCenterY = stackY + book.height / 2
        stackY += book.height
        return (
          <mesh
            key={i}
            ref={(el) => {
              if (el) meshRefs.current[i] = el
            }}
            position={[book.offset, bookCenterY, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[book.width, book.height, book.depth]} />
            <meshStandardMaterial
              color={book.color}
              roughness={0.8}
              emissive={book.color}
              emissiveIntensity={0}
            />
            {book.label && (
              <Html
                transform
                position={[-book.width / 2 - 0.001, 0, 0]}
                rotation-y={-Math.PI / 2}
                scale={0.05}
              >
                <div className="pointer-events-none w-[80px] text-center font-sans text-[10px] font-bold uppercase tracking-widest text-white/80">
                  {book.label}
                </div>
              </Html>
            )}
          </mesh>
        )
      })}
    </group>
  )
}
