'use client'

import { Environment, Lightformer } from '@react-three/drei'
import { useLivery } from '@/features/livery/useLivery'

// A photo-studio environment built from softboxes, so reflections stay crisp
// and nothing loads from a CDN. Two coloured strips pick up the livery,
// which is where the clearcoat gets its gradient.
export function StudioLights() {
  const livery = useLivery((s) => s.livery)

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <Environment resolution={256} frames={Infinity}>
        {/* Key: one broad overhead softbox */}
        <Lightformer
          form="rect"
          intensity={2.6}
          position={[0, 5, 1]}
          scale={[10, 4, 1]}
          rotation-x={Math.PI / 2}
        />
        {/* Livery strips: these paint the gradient into the clearcoat */}
        <Lightformer
          form="rect"
          intensity={2.4}
          color={livery.sheen}
          position={[5, 0.5, 0]}
          scale={[3, 8, 1]}
          rotation-y={-Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color={livery.gradient[1]}
          position={[-5, -1, 0]}
          scale={[3, 8, 1]}
          rotation-y={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1}
          color={livery.gradient[0]}
          position={[0, 0, -6]}
          scale={[14, 8, 1]}
        />
        {/* Small hard catchlight for that showroom glint */}
        <Lightformer
          form="circle"
          intensity={6}
          position={[2, 2.5, 4]}
          scale={0.6}
        />
      </Environment>
    </>
  )
}
