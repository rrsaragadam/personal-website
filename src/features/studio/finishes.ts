import * as THREE from 'three'
import { brushedLinear } from './textures'

// Shared surfaces: bead-blasted aluminium, anodised colour and polished
// edges. Created once, on the client.
let cache: ReturnType<typeof create> | null = null

function create() {
  const brushed = brushedLinear()
  brushed.repeat.set(1, 3)

  return {
    brushed,
    // Bead-blasted: a soft satin that spreads highlights into a glow.
    blasted: new THREE.MeshPhysicalMaterial({
      color: '#cfd0d5',
      metalness: 1,
      roughness: 0.48,
      roughnessMap: brushed,
    }),
    polished: new THREE.MeshPhysicalMaterial({
      color: '#eceef2',
      metalness: 1,
      roughness: 0.08,
    }),
  }
}

export function finishes() {
  if (!cache) cache = create()
  return cache
}

// Anodised aluminium in any colour: the dye sits under a hard, slightly
// glossy oxide layer, so it reads as colour-in-metal rather than paint.
export function anodised(color: string) {
  const { brushed } = finishes()
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.85,
    roughness: 0.3,
    roughnessMap: brushed,
    clearcoat: 0.6,
    clearcoatRoughness: 0.18,
  })
}
