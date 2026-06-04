'use client'

import { useRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'
import { paletteFor, rgbOf } from '@/lib/sceneConfig'
import { disableOutline } from '@/lib/toon'

// A large back-side sphere with a vertical two-color gradient. Stylized and fully
// controllable (unlike drei <Sky>'s physical model), and trivially GSAP-tweenable.
export function GradientSky() {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const isDayMode = useSceneStore((s) => s.isDayMode)

  const uniforms = useMemo(() => {
    const p = paletteFor(true)
    return {
      uTopColor: { value: new THREE.Color(p.skyTop) },
      uBottomColor: { value: new THREE.Color(p.skyBottom) },
      uExponent: { value: 0.85 },
    }
  }, [])

  // The sky is a back-side sphere; without this the global OutlineEffect draws a
  // screen-filling inverted-hull "outline" over it, blacking out the backdrop.
  useEffect(() => {
    if (matRef.current) disableOutline(matRef.current)
  }, [])

  useEffect(() => {
    if (!matRef.current) return
    const p = paletteFor(isDayMode)
    const top = matRef.current.uniforms.uTopColor.value as THREE.Color
    const bottom = matRef.current.uniforms.uBottomColor.value as THREE.Color

    const topProxy = { ...rgbOf(`#${top.getHexString()}`) }
    const topTo = rgbOf(p.skyTop)
    gsap.to(topProxy, {
      ...topTo,
      duration: 1.5,
      onUpdate: () => top.setRGB(topProxy.r, topProxy.g, topProxy.b),
    })

    const bottomProxy = { ...rgbOf(`#${bottom.getHexString()}`) }
    const bottomTo = rgbOf(p.skyBottom)
    gsap.to(bottomProxy, {
      ...bottomTo,
      duration: 1.5,
      onUpdate: () => bottom.setRGB(bottomProxy.r, bottomProxy.g, bottomProxy.b),
    })
  }, [isDayMode])

  return (
    <mesh scale={[1, 1, 1]}>
      <sphereGeometry args={[90, 32, 16]} />
      <shaderMaterial
        ref={matRef}
        side={THREE.BackSide}
        depthWrite={false}
        fog={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec3 vWorldPos;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldPos = wp.xyz;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform vec3 uTopColor;
          uniform vec3 uBottomColor;
          uniform float uExponent;
          varying vec3 vWorldPos;
          void main() {
            float h = normalize(vWorldPos).y;            // -1 .. 1
            float t = pow(smoothstep(-0.05, 0.6, h), uExponent);
            gl_FragColor = vec4(mix(uBottomColor, uTopColor, t), 1.0);
          }
        `}
      />
    </mesh>
  )
}
