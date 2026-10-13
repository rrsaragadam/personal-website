import * as THREE from 'three'

// Everything printed, written or stuck into the journal is painted onto
// canvases at runtime, so the pages are real content rather than images.

export function canvas(w: number, h: number) {
  const c = document.createElement('canvas')
  c.width = w
  c.height = h
  return [c, c.getContext('2d')!] as const
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

export const FONT = {
  hand: () => family('--font-caveat', 'cursive'),
  marker: () => family('--font-marker', 'cursive'),
  sans: () => family('--font-geist-sans', 'sans-serif'),
  mono: () => family('--font-geist-mono', 'monospace'),
}

// A small seeded generator, so hand-made wobble and paper grain are the
// same on every visit.
export function seeded(seed: number) {
  let s = seed >>> 0 || 1
  return () => {
    s ^= s << 13
    s ^= s >>> 17
    s ^= s << 5
    return ((s >>> 0) % 100000) / 100000
  }
}

const images = new Map<string, HTMLImageElement>()
const pending = new Map<string, Promise<HTMLImageElement>>()

export function loadImage(src: string) {
  if (!pending.has(src)) {
    pending.set(
      src,
      new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          images.set(src, img)
          resolve(img)
        }
        img.onerror = () => resolve(img)
        img.src = src
      })
    )
  }
  return pending.get(src)!
}

// The image if it has loaded, else nothing (painters draw a blank print).
export function image(src: string) {
  return images.get(src)
}

// A canvas texture that repaints once fonts and images are ready.
export function paintedTexture(
  w: number,
  h: number,
  draw: (ctx: CanvasRenderingContext2D, w: number, h: number) => void,
  srcs: string[] = []
) {
  const [c, ctx] = canvas(w, h)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const repaint = () => {
    ctx.save()
    ctx.clearRect(0, 0, w, h)
    draw(ctx, w, h)
    ctx.restore()
    tex.needsUpdate = true
  }
  repaint()
  Promise.all([document.fonts?.ready, ...srcs.map(loadImage)]).then(repaint)
  return tex
}
