'use client'

const FRAME_COLOR = '#8b7355'
const FRAME_DARK = '#6b5535'

export function PictureFrame() {
  return (
    <group position={[-1.6, 0.85, -0.82]} rotation-y={0.2}>
      {/* Frame sides */}
      {/* Top */}
      <mesh position={[0, 0.46, 0]} castShadow>
        <boxGeometry args={[0.88, 0.07, 0.06]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Bottom */}
      <mesh position={[0, -0.46, 0]} castShadow>
        <boxGeometry args={[0.88, 0.07, 0.06]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Left */}
      <mesh position={[-0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.85, 0.06]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.2} />
      </mesh>
      {/* Right */}
      <mesh position={[0.4, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.85, 0.06]} />
        <meshStandardMaterial color={FRAME_COLOR} roughness={0.5} metalness={0.2} />
      </mesh>

      {/* Inner corner detail */}
      {[[-0.4, 0.46], [0.4, 0.46], [-0.4, -0.46], [0.4, -0.46]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0]} castShadow>
          <boxGeometry args={[0.07, 0.07, 0.065]} />
          <meshStandardMaterial color={FRAME_DARK} roughness={0.4} metalness={0.3} />
        </mesh>
      ))}

      {/* Canvas — empty/dark */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[0.73, 0.79, 0.006]} />
        <meshStandardMaterial color="#e8e0d4" roughness={0.95} />
      </mesh>

      {/* Support foot */}
      <mesh position={[0.05, -0.6, -0.14]} rotation-x={-0.5} castShadow>
        <boxGeometry args={[0.06, 0.4, 0.022]} />
        <meshStandardMaterial color={FRAME_DARK} roughness={0.5} metalness={0.2} />
      </mesh>
    </group>
  )
}
