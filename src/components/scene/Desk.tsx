'use client'

import { Laptop } from './objects/Laptop'
import { CRTMonitor } from './objects/CRTMonitor'
import { IPad } from './objects/IPad'
import { Books } from './objects/Books'
import { Headphones } from './objects/Headphones'
import { Phone } from './objects/Phone'
import { PictureFrame } from './objects/PictureFrame'

const WOOD_COLOR = '#8b6914'
const LEG_COLOR = '#7a5c10'

function DeskTop() {
  return (
    <mesh position={[0, 0, 0]} castShadow receiveShadow>
      <boxGeometry args={[6.2, 0.15, 2.5]} />
      <meshStandardMaterial color={WOOD_COLOR} roughness={0.45} metalness={0.05} />
    </mesh>
  )
}

function DeskLegs() {
  const legPositions: [number, number, number][] = [
    [-2.85, -0.45, -1.05],
    [2.85, -0.45, -1.05],
    [-2.85, -0.45, 1.05],
    [2.85, -0.45, 1.05],
  ]
  return (
    <>
      {legPositions.map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.14, 0.75, 0.14]} />
          <meshStandardMaterial color={LEG_COLOR} roughness={0.55} metalness={0.05} />
        </mesh>
      ))}
      {/* Cross braces */}
      <mesh position={[0, -0.6, -1.05]} castShadow>
        <boxGeometry args={[5.6, 0.08, 0.08]} />
        <meshStandardMaterial color={LEG_COLOR} roughness={0.55} metalness={0.05} />
      </mesh>
      <mesh position={[0, -0.6, 1.05]} castShadow>
        <boxGeometry args={[5.6, 0.08, 0.08]} />
        <meshStandardMaterial color={LEG_COLOR} roughness={0.55} metalness={0.05} />
      </mesh>
    </>
  )
}

function DeskMat() {
  return (
    <mesh position={[-0.3, 0.08, 0.38]} receiveShadow>
      <boxGeometry args={[2.6, 0.012, 1.3]} />
      <meshStandardMaterial color="#2d5a3d" roughness={0.9} metalness={0} />
    </mesh>
  )
}

export function Desk() {
  return (
    <group>
      <DeskTop />
      <DeskLegs />
      <DeskMat />
      <Books />
      <Headphones />
      <Laptop />
      <Phone />
      <IPad />
      <CRTMonitor />
      <PictureFrame />
    </group>
  )
}
