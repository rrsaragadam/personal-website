import * as THREE from 'three'
import { brushedLinear, brushedRadial, leatherGrain } from './textures'

// One set of shared finishes for every part of the console: billet
// aluminium in two brush patterns, glass, and a dark anodised trim.
let cache: ReturnType<typeof create> | null = null

function create() {
  const linear = brushedLinear()
  linear.repeat.set(2, 1)
  const radial = brushedRadial()
  const grain = leatherGrain()
  grain.repeat.set(14, 14)

  return {
    aluminium: new THREE.MeshPhysicalMaterial({
      color: '#c8cad0',
      metalness: 1,
      roughness: 0.3,
      roughnessMap: linear,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
    }),
    aluminiumTurned: new THREE.MeshPhysicalMaterial({
      color: '#d4d6dc',
      metalness: 1,
      roughness: 0.26,
      roughnessMap: radial,
    }),
    aluminiumPolished: new THREE.MeshPhysicalMaterial({
      color: '#e2e3e8',
      metalness: 1,
      roughness: 0.1,
    }),
    anodised: new THREE.MeshPhysicalMaterial({
      color: '#2a2b30',
      metalness: 0.7,
      roughness: 0.42,
    }),
    // Soft-touch hide for the dashboard, wheel rim and tunnel. Its colour
    // drifts toward each finish (see Dashboard).
    leather: new THREE.MeshPhysicalMaterial({
      color: '#141317',
      roughness: 0.62,
      roughnessMap: grain,
      bumpMap: grain,
      bumpScale: 0.6,
      sheen: 0.35,
      sheenRoughness: 0.5,
      sheenColor: new THREE.Color('#55535c'),
    }),
    // Thin cover glass: mostly reflection, so screens read clearly through it.
    // (No transmission pass, which keeps the scene cheap to render.)
    glass: new THREE.MeshPhysicalMaterial({
      color: '#ffffff',
      metalness: 0,
      roughness: 0.03,
      transparent: true,
      opacity: 0.16,
      clearcoat: 1,
      envMapIntensity: 1.6,
      depthWrite: false,
    }),
    // Thick glass, as in the key: tinted and a little more present.
    glassSlab: new THREE.MeshPhysicalMaterial({
      color: '#eef3f6',
      metalness: 0,
      roughness: 0.05,
      transparent: true,
      opacity: 0.38,
      clearcoat: 1,
      envMapIntensity: 2,
      depthWrite: false,
    }),
  }
}

export function materials() {
  if (!cache) cache = create()
  return cache
}
