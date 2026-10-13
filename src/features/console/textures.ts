import * as THREE from 'three'

// Procedural surface textures, so the machined finishes need no image assets.

function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
}

// Straight-line brushing, as on a milled aluminium plate. Used as a roughness
// map: light streaks are slightly rougher than dark ones.
export function brushedLinear() {
  const [c, ctx] = canvas(512, 512)
  ctx.fillStyle = '#8a8a8a'
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 2600; i++) {
    const v = 110 + Math.random() * 60
    ctx.strokeStyle = `rgba(${v},${v},${v},${0.15 + Math.random() * 0.25})`
    ctx.lineWidth = Math.random() * 1.2
    const y = Math.random() * 512
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(512, y + (Math.random() - 0.5) * 2)
    ctx.stroke()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}

// Concentric brushing, as on the face of a turned dial.
export function brushedRadial() {
  const [c, ctx] = canvas(512, 512)
  ctx.fillStyle = '#8a8a8a'
  ctx.fillRect(0, 0, 512, 512)
  for (let r = 2; r < 256; r += 0.6) {
    const v = 105 + Math.random() * 70
    ctx.strokeStyle = `rgba(${v},${v},${v},${0.25 + Math.random() * 0.3})`
    ctx.lineWidth = 0.6
    ctx.beginPath()
    ctx.arc(256, 256, r, 0, Math.PI * 2)
    ctx.stroke()
  }
  return new THREE.CanvasTexture(c)
}

// Draws text into a texture once the page's web fonts are ready, so labels
// use Geist rather than a fallback. `repaint` redraws, optionally with a new
// drawing function (e.g. when the livery changes).
type Draw = (ctx: CanvasRenderingContext2D, w: number, h: number) => void

export function textTexture(w: number, h: number, draw: Draw) {
  const [c, ctx] = canvas(w, h)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  let current = draw
  const repaint = (next?: Draw) => {
    if (next) current = next
    ctx.clearRect(0, 0, w, h)
    current(ctx, w, h)
    tex.needsUpdate = true
  }
  repaint()
  document.fonts?.ready.then(() => repaint())
  return { tex, repaint }
}

export const SANS = 'Geist, ui-sans-serif, system-ui, sans-serif'
export const MONO = '"Geist Mono", ui-monospace, monospace'

// Fine pebble grain for the leather, used as a bump and roughness map.
export function leatherGrain() {
  const [c, ctx] = canvas(512, 512)
  ctx.fillStyle = '#808080'
  ctx.fillRect(0, 0, 512, 512)
  for (let i = 0; i < 9000; i++) {
    const v = 70 + Math.random() * 120
    ctx.fillStyle = `rgba(${v},${v},${v},0.5)`
    ctx.beginPath()
    ctx.arc(
      Math.random() * 512,
      Math.random() * 512,
      1 + Math.random() * 2.6,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }
  const t = new THREE.CanvasTexture(c)
  t.wrapS = t.wrapT = THREE.RepeatWrapping
  return t
}
