'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

// Renders the portfolio "product designer" landing onto a canvas texture, then
// maps it onto a thin plane seated just in front of the laptop's display panel.
function makeScreenTexture() {
  const w = 1024
  const h = 640
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')!

  // Soft warm-white wallpaper with a faint vertical gradient.
  const grad = ctx.createLinearGradient(0, 0, 0, h)
  grad.addColorStop(0, '#fbf7f0')
  grad.addColorStop(1, '#f1ece2')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, w, h)

  ctx.textAlign = 'left'

  // Eyebrow line.
  ctx.fillStyle = '#9a948a'
  ctx.font = '500 30px Georgia, serif'
  ctx.fillText('for your eyes only', 96, 150)

  // Headline — editorial serif, two lines, confident scale.
  ctx.fillStyle = '#2b2b2b'
  ctx.font = 'italic 600 118px Georgia, serif'
  ctx.fillText('product', 92, 280)
  ctx.fillStyle = '#3f7d54'
  ctx.fillText('designer', 92, 400)

  // Small sign-off.
  ctx.fillStyle = '#9a948a'
  ctx.font = '500 26px Georgia, serif'
  ctx.fillText('— folio ’26', 98, 470)

  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  return tex
}

interface LaptopScreenProps {
  position: [number, number, number]
  rotation?: [number, number, number]
  size: [number, number]
}

export function LaptopScreen({ position, rotation = [0, 0, 0], size }: LaptopScreenProps) {
  const tex = useMemo(() => makeScreenTexture(), [])
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={size} />
      <meshBasicMaterial map={tex} toneMapped={false} />
    </mesh>
  )
}
