'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, useLoader } from '@react-three/fiber'
import { Environment } from '@react-three/drei'
import { canvas } from './canvas'

// A picnic table in a pine forest on a late summer afternoon: the forest
// is a real photographed sky and treeline (Poly Haven, CC0) that lights
// everything, and the sun comes through the canopy in shifting patches.
export function Outdoors() {
  return (
    <>
      <Environment
        files="/journal/forest.hdr"
        background
        backgroundBlurriness={0.06}
        backgroundIntensity={0.9}
        environmentIntensity={0.6}
      />
      <Canopy />
      <Table />
    </>
  )
}

function Table() {
  const [map, normalMap, roughnessMap] = useLoader(THREE.TextureLoader, [
    '/journal/table_diff.jpg',
    '/journal/table_nor_gl.jpg',
    '/journal/table_rough.jpg',
  ])
  useMemo(() => {
    for (const t of [map, normalMap, roughnessMap]) {
      t.wrapS = t.wrapT = THREE.RepeatWrapping
      t.repeat.set(3, 2)
      t.anisotropy = 8
    }
    map.colorSpace = THREE.SRGBColorSpace
  }, [map, normalMap, roughnessMap])

  return (
    <mesh rotation-x={-Math.PI / 2} position={[0.2, 0, -0.4]} receiveShadow>
      <planeGeometry args={[12, 5]} />
      <meshStandardMaterial
        map={map}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
        color="#d8c7b0"
      />
    </mesh>
  )
}

// Sunlight through leaves: a spotlight projecting a soft canopy pattern,
// swaying slowly as if in a breeze.
function Canopy() {
  const light = useRef<THREE.SpotLight>(null)
  const gobo = useMemo(() => {
    const [c, ctx] = canvas(512, 512)
    // Mostly shade, with warm pools where the canopy opens up.
    ctx.fillStyle = '#2a2a1c'
    ctx.fillRect(0, 0, 512, 512)
    ctx.filter = 'blur(9px)'
    let s = 7
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647
    for (let i = 0; i < 46; i++) {
      ctx.fillStyle = `rgba(255, 238, 200, ${0.65 + r() * 0.35})`
      ctx.beginPath()
      ctx.ellipse(
        r() * 512,
        r() * 512,
        20 + r() * 60,
        14 + r() * 40,
        r() * Math.PI,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }
    const t = new THREE.CanvasTexture(c)
    t.colorSpace = THREE.SRGBColorSpace
    return t
  }, [])

  useFrame(({ clock }) => {
    const l = light.current
    if (!l) return
    const t = clock.elapsedTime
    l.target.position.set(
      Math.sin(t * 0.35) * 0.05,
      0,
      Math.cos(t * 0.27) * 0.04
    )
    l.target.updateMatrixWorld()
  })

  return (
    <spotLight
      ref={light}
      position={[-3.5, 7, -2.5]}
      angle={0.42}
      penumbra={0.5}
      intensity={320}
      color="#ffe6bf"
      map={gobo}
      castShadow
      shadow-mapSize={[2048, 2048]}
      shadow-bias={-0.0001}
      shadow-normalBias={0.02}
    />
  )
}
