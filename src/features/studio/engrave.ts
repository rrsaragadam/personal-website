import * as THREE from 'three'
import { textTexture } from './textures'

type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void

// A mask for laser-engraved marks: white where the metal is cut, black
// elsewhere. Used as an alpha map on a skin that sits just above a face.
export function engraving(w: number, h: number, draw: Draw) {
  const { tex } = textTexture(w, h, (ctx, cw, ch) => {
    ctx.fillStyle = '#000'
    ctx.fillRect(0, 0, cw, ch)
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#fff'
    draw(ctx, cw, ch)
  })
  tex.colorSpace = THREE.NoColorSpace
  return tex
}

// The cut itself: darker and rougher than the surface around it.
export function engravedSkin(mask: THREE.Texture, color = '#3a3b40') {
  return new THREE.MeshPhysicalMaterial({
    color,
    metalness: 0.9,
    roughness: 0.62,
    alphaMap: mask,
    transparent: true,
    depthWrite: false,
    polygonOffset: true,
    polygonOffsetFactor: -2,
  })
}

// Letter-spaced text, which canvas only supports natively in some browsers.
export function tracked(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  spacing: number
) {
  let cx = x
  for (const ch of text) {
    ctx.fillText(ch, cx, y)
    cx += ctx.measureText(ch).width + spacing
  }
  return cx - x - spacing
}
