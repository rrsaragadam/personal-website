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
    // Each repaint starts from a clean state (alignment, fonts, fills).
    ctx.save()
    current(ctx, w, h)
    ctx.restore()
    tex.needsUpdate = true
  }
  repaint()
  document.fonts?.ready.then(() => repaint())
  return { tex, repaint }
}

// next/font gives each face a generated family name, exposed as a CSS
// variable on <html>; canvas text has to use that name to get the real font.
function family(variable: string, fallback: string) {
  if (typeof document === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim()
  return v ? `${v}, ${fallback}` : fallback
}

export const SANS = () => family('--font-geist-sans', 'sans-serif')
export const MONO = () => family('--font-geist-mono', 'monospace')
export const SERIF = () => family('--font-instrument-serif', 'serif')
