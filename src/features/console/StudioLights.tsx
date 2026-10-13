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
      <ambientLight intensity={0.4} />
      <directionalLight position={[3, 5, 4]} intensity={0.8} />
      <Environment resolution={256} frames={Infinity}>
        {/* The console faces the viewer at a tilt, so its metal mirrors the
            ceiling. A broad dim ceiling gives the satin base tone; a pale
            softbox and a band of the paint colour across it become the soft
            gradient that runs down the brushed plate. */}
        <Lightformer
          form="rect"
          intensity={0.75}
          position={[0, 8, 2]}
          scale={[30, 30, 1]}
          rotation-x={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={2.2}
          color={livery.gradient[3]}
          position={[0, 6, -1]}
          scale={[16, 2.5, 1]}
          rotation-x={Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1.8}
          color={livery.paint}
          position={[0, 6, 4.5]}
          scale={[16, 2, 1]}
          rotation-x={Math.PI / 2}
        />
        {/* Side strips in the livery's other colours for the edges */}
        <Lightformer
          form="rect"
          intensity={2}
          color={livery.sheen}
          position={[5, 0.5, 0]}
          scale={[3, 8, 1]}
          rotation-y={-Math.PI / 2}
        />
        <Lightformer
          form="rect"
          intensity={1.6}
          color={livery.gradient[1]}
          position={[-5, -1, 0]}
          scale={[3, 8, 1]}
          rotation-y={Math.PI / 2}
        />
        {/* Small hard catchlight for that showroom glint */}
        <Lightformer
          form="circle"
          intensity={5}
          position={[2, 4, 3]}
          scale={0.5}
        />
      </Environment>
    </>
  )
}
