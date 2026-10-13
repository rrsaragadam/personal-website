'use client'

import { useMemo } from 'react'
import type { ThreeElements } from '@react-three/fiber'
import { textTexture, MONO } from './textures'

type EngravingProps = ThreeElements['mesh'] & {
  text: string
  width?: number
}

// A label etched into the aluminium, lying flat on the panel.
export function Engraving({ text, width = 0.56, ...props }: EngravingProps) {
  const tex = useMemo(
    () =>
      textTexture(512, 112, (ctx, w, h) => {
        ctx.fillStyle = 'rgba(30,30,36,0.8)'
        ctx.font = `600 ${h * 0.46}px ${MONO}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.letterSpacing = `${h * 0.06}px`
        ctx.fillText(text.toUpperCase(), w / 2, h / 2)
      }),
    [text]
  )
  return (
    <mesh rotation-x={-Math.PI / 2} position-y={0.004} {...props}>
      <planeGeometry args={[width, (width * 112) / 512]} />
      <meshBasicMaterial
        map={tex.tex}
        transparent
        toneMapped={false}
        polygonOffset
        polygonOffsetFactor={-2}
      />
    </mesh>
  )
}
