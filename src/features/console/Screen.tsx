'use client'

import { Html, RoundedBox } from '@react-three/drei'
import type { ThreeElements } from '@react-three/fiber'
import { ScreenContent } from '@/features/screen/ScreenContent'
import { materials } from './materials'

type ScreenProps = ThreeElements['group'] & {
  // Size on the console, in scene units.
  size: [number, number]
  // CSS pixel width the content is laid out at; height follows the aspect.
  px: number
}

// The centre screen: an anodised bezel holding a glass-covered OLED, with the
// site's actual content projected onto it.
export function Screen({ size: [w, h], px, ...props }: ScreenProps) {
  const m = materials()
  const pxH = Math.round((px * h) / w)
  return (
    <group {...props}>
      <RoundedBox
        args={[w + 0.12, 0.05, h + 0.12]}
        radius={0.03}
        position-y={0.012}
        material={m.anodised}
      />
      <mesh rotation-x={-Math.PI / 2} position-y={0.04}>
        <planeGeometry args={[w, h]} />
        <meshBasicMaterial color="#060608" />
      </mesh>
      <Html
        transform
        rotation-x={-Math.PI / 2}
        position-y={0.042}
        distanceFactor={(w * 400) / px}
        zIndexRange={[10, 0]}
      >
        <ScreenContent width={px} height={pxH} />
      </Html>
    </group>
  )
}
