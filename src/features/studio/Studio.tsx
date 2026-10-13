'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import { useAccent } from './useAccent'

const tint = new THREE.Color()

// A product photographer's set: a long softbox overhead, two tall strips
// either side for the clean edge highlights you see on machined metal, a
// hard kicker behind, and one gel in the colour of whatever is in focus.
export function Studio() {
  const accent = useAccent((s) => s.accent)
  const gel = useRef<THREE.Mesh>(null)

  useFrame((_, dt) => {
    const m = gel.current?.material as THREE.MeshBasicMaterial | undefined
    // Lightformers bake their intensity into the colour.
    if (m)
      m.color.lerp(tint.set(accent).multiplyScalar(2.4), 1 - Math.exp(-dt * 3))
  })

  return (
    <>
      <Environment resolution={256} frames={Infinity}>
        <Lightformer
          form="rect"
          intensity={2.2}
          position={[0, 5, 1]}
          rotation-x={Math.PI / 2}
          scale={[8, 2.4, 1]}
        />
        <Lightformer
          form="rect"
          intensity={3.2}
          position={[-4.5, 0.4, 1.5]}
          rotation-y={Math.PI / 2}
          scale={[0.6, 7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={2}
          position={[4.5, 0.4, 1.5]}
          rotation-y={-Math.PI / 2}
          scale={[0.9, 7, 1]}
        />
        <Lightformer
          form="rect"
          intensity={6}
          position={[2.5, 2, -5]}
          scale={[1.2, 0.25, 1]}
        />
        {/* A big, dim fill behind the camera, so faces turned toward you
            read as bright satin metal rather than a black mirror */}
        <Lightformer
          form="rect"
          intensity={0.6}
          position={[0, 2.6, 6]}
          rotation-y={Math.PI}
          scale={[9, 1.6, 1]}
        />
        <Lightformer
          ref={gel}
          form="ring"
          intensity={2.4}
          position={[-2, -1.5, -4]}
          scale={3}
        />
      </Environment>
      <ambientLight intensity={0.05} />
      <spotLight
        position={[2, 6, 5]}
        angle={0.45}
        penumbra={1}
        intensity={14}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0002}
      />
      <Backdrop accent={accent} />
    </>
  )
}

// The sweep behind the objects: near-black with a soft pool of light that
// takes on the accent, so glass has something to bend and metal has an edge
// to separate from.
function Backdrop({ accent }: { accent: string }) {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        depthWrite: false,
        uniforms: {
          uAccent: { value: new THREE.Color(accent) },
          uTime: { value: 0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uAccent;
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            vec2 p = vUv - vec2(0.5 + 0.04 * sin(uTime * 0.11), 0.56);
            p.x *= 1.6;
            float pool = exp(-dot(p, p) * 5.0);
            float warm = exp(-dot(p - vec2(0.25, -0.1), p - vec2(0.25, -0.1)) * 9.0);
            vec3 base = vec3(0.0016, 0.0016, 0.002);
            vec3 col = base + vec3(0.016, 0.0155, 0.015) * pool + uAccent * 0.02 * warm;
            gl_FragColor = vec4(col, 1.0);
            #include <colorspace_fragment>
          }
        `,
      }),
    // The colour is tweened in useFrame; build the material once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  useFrame(({ clock }, dt) => {
    material.uniforms.uTime.value = clock.elapsedTime
    ;(material.uniforms.uAccent.value as THREE.Color).lerp(
      tint.set(accent),
      1 - Math.exp(-dt * 3)
    )
  })

  return (
    <mesh position={[0, 0, -6]} material={material}>
      <planeGeometry args={[30, 18]} />
    </mesh>
  )
}
