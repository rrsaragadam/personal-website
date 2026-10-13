'use client'

import { Environment, Lightformer } from '@react-three/drei'
import { useLivery } from '@/features/livery/useLivery'

// Daylight through the glass, built from softboxes so nothing loads from a
// CDN. The environment is captured from the origin and each softbox faces
// it, so positions here are really directions. The windscreen is a broad pale panel ahead; the rear and side windows
// carry the finish's colours, so the aluminium faces (which mirror what is
// behind the driver) pick up a soft gradient of the livery.
export function CabinLights() {
  const livery = useLivery((s) => s.livery)

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[-1.5, 3, -2.5]}
        intensity={1.4}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-1.5}
        shadow-camera-right={1.5}
        shadow-camera-top={1.5}
        shadow-camera-bottom={-1.5}
      />
      <directionalLight position={[1, 2, 3]} intensity={0.5} />
      <Environment resolution={256} frames={Infinity}>
        {/* Sky overhead and the windscreen ahead */}
        <Lightformer
          form="rect"
          intensity={0.6}
          position={[0, 6, 0]}
          scale={[20, 20, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.5}
          position={[0, 1.2, -3]}
          scale={[9, 2.6, 1]}
        />
        {/* Behind the driver: a broad neutral glow at head height (what
            faces turned toward the seats mirror), and the rear window in
            the finish colour above it */}
        <Lightformer
          form="rect"
          intensity={0.85}
          position={[0, 0, 3]}
          scale={[8, 2.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.4}
          color={livery.paint}
          position={[0, 1.8, 3]}
          scale={[6, 1.2, 1]}
        />
        <Lightformer
          form="rect"
          intensity={1.4}
          color={livery.gradient[3]}
          position={[0, 3.2, 1.8]}
          scale={[6, 1.6, 1]}
        />
        {/* Side windows */}
        <Lightformer
          form="rect"
          intensity={0.5}
          color={livery.gradient[1]}
          position={[-3, 0.6, 0]}
          scale={[3, 1, 1]}
        />
        <Lightformer
          form="rect"
          intensity={0.5}
          color={livery.sheen}
          position={[3, 0.6, 0]}
          scale={[3, 1, 1]}
        />
        {/* A hard glint for the polished parts */}
        <Lightformer
          form="circle"
          intensity={6}
          position={[1.2, 3, 2]}
          scale={0.4}
        />
      </Environment>
    </>
  )
}
