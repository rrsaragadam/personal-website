// Shared day/night palette consumed by Lighting, SceneEnvironment, GradientSky.
// Colors stored as hex; helpers expose normalized RGB for GSAP proxy tweens.
import * as THREE from 'three'

export interface ScenePalette {
  skyTop: string
  skyBottom: string // also used as fog color so the horizon blends seamlessly
  fogNear: number
  fogFar: number
  ambientColor: string
  ambientIntensity: number
  sunColor: string
  sunIntensity: number
  sunPosition: [number, number, number]
  grassTint: string
  moonGlow: string
}

export const DAY: ScenePalette = {
  skyTop: '#3fa3e6',
  skyBottom: '#c4e8fb',
  fogNear: 18,
  fogFar: 62,
  ambientColor: '#fff7ea',
  ambientIntensity: 1.0,
  sunColor: '#fff3d2',
  sunIntensity: 2.15,
  sunPosition: [9, 18, 12],
  grassTint: '#8ace52',
  moonGlow: '#cfd8ff',
}

export const NIGHT: ScenePalette = {
  skyTop: '#0b1026',
  skyBottom: '#1c2540',
  fogNear: 16,
  fogFar: 52,
  ambientColor: '#2a3a5c',
  ambientIntensity: 0.18,
  sunColor: '#9fb0d8',
  sunIntensity: 0.35,
  sunPosition: [-6, 16, 8],
  grassTint: '#3f5f4a',
  moonGlow: '#cfd8ff',
}

export const paletteFor = (isDayMode: boolean): ScenePalette =>
  isDayMode ? DAY : NIGHT

// Returns { r, g, b } in 0..1 for GSAP proxy tweening.
export const rgbOf = (hex: string) => {
  const c = new THREE.Color(hex)
  return { r: c.r, g: c.g, b: c.b }
}
