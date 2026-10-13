import { FONT, image, seeded } from './canvas'

// The journal's hand: paper, pens, tape, label-maker strips, prints and
// stamps, all painted with a little seeded wobble so nothing is perfectly
// straight.

type Ctx = CanvasRenderingContext2D

export const PAGE_W = 1024
export const PAGE_H = 1593

export const INK = {
  pen: '#1d2741',
  pencil: '#5d5a55',
  red: '#c0392b',
  green: '#3f6b4a',
  rule: 'rgba(70, 110, 140, 0.22)',
  highlighter: 'rgba(255, 214, 64, 0.5)',
}

export function paper(
  ctx: Ctx,
  w: number,
  h: number,
  kind: 'dot' | 'grid' | 'lined' | 'plain',
  seed: number,
  folio?: number
) {
  const r = seeded(seed)
  ctx.fillStyle = '#f0e4c9'
  ctx.fillRect(0, 0, w, h)
  // Fibres and the odd fleck
  for (let i = 0; i < 2600; i++) {
    ctx.fillStyle = `rgba(120, 96, 60, ${r() * 0.05})`
    ctx.fillRect(r() * w, r() * h, 1 + r() * 2, 1 + r() * 2)
  }
  ctx.strokeStyle = INK.rule
  ctx.fillStyle = INK.rule
  const step = 40
  if (kind === 'grid') {
    ctx.lineWidth = 1.2
    for (let x = step / 2; x < w; x += step) line(ctx, x, 0, x, h)
    for (let y = step / 2; y < h; y += step) line(ctx, 0, y, w, y)
  } else if (kind === 'dot') {
    for (let x = step / 2; x < w; x += step)
      for (let y = step / 2; y < h; y += step) {
        ctx.beginPath()
        ctx.arc(x, y, 2.2, 0, Math.PI * 2)
        ctx.fill()
      }
  } else if (kind === 'lined') {
    ctx.lineWidth = 1.4
    for (let y = 150; y < h - 40; y += 52) line(ctx, 0, y, w, y)
  }
  // Handling: edges a shade darker than the middle
  const g = ctx.createRadialGradient(
    w / 2,
    h / 2,
    h * 0.3,
    w / 2,
    h / 2,
    h * 0.75
  )
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(90, 64, 30, 0.13)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  if (folio) {
    ctx.fillStyle = 'rgba(40, 40, 40, 0.45)'
    ctx.font = `500 22px ${FONT.mono()}`
    ctx.textAlign = folio % 2 ? 'right' : 'left'
    ctx.fillText(
      String(folio).padStart(2, '0'),
      folio % 2 ? w - 44 : 44,
      h - 36
    )
    ctx.textAlign = 'left'
  }
}

export function kraft(ctx: Ctx, w: number, h: number, seed: number) {
  const r = seeded(seed)
  ctx.fillStyle = '#b28a5c'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 9000; i++) {
    const d = r() < 0.5
    ctx.fillStyle = d
      ? `rgba(70, 45, 20, ${r() * 0.16})`
      : `rgba(235, 205, 160, ${r() * 0.14})`
    ctx.fillRect(r() * w, r() * h, 1 + r() * 3, 1 + r() * 1.4)
  }
  // Worn, darker edges and corners from being carried around
  const g = ctx.createRadialGradient(
    w / 2,
    h / 2,
    h * 0.25,
    w / 2,
    h / 2,
    h * 0.8
  )
  g.addColorStop(0, 'rgba(0,0,0,0)')
  g.addColorStop(1, 'rgba(60, 35, 15, 0.38)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, w, h)
  // Scuffs
  for (let i = 0; i < 40; i++) {
    ctx.strokeStyle = `rgba(240, 215, 175, ${0.08 + r() * 0.1})`
    ctx.lineWidth = 1 + r() * 2
    const x = r() * w
    const y = r() * h
    line(ctx, x, y, x + (r() - 0.5) * 120, y + (r() - 0.5) * 30)
  }
}

export function line(ctx: Ctx, x1: number, y1: number, x2: number, y2: number) {
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.stroke()
}

interface HandOpts {
  size?: number
  color?: string
  weight?: number
  rot?: number
  font?: 'hand' | 'marker'
  seed?: number
  align?: 'left' | 'center' | 'right'
}

// Handwriting: each letter sits a little off the baseline and the whole
// line drifts by a degree or so. Returns the width written.
export function hand(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  o: HandOpts = {}
) {
  const {
    size = 44,
    color = INK.pen,
    weight = 500,
    rot = 0,
    font = 'hand',
    seed = text.length * 7 + Math.round(x + y),
    align = 'left',
  } = o
  const r = seeded(seed)
  ctx.save()
  ctx.font = `${weight} ${size}px ${FONT[font]()}`
  ctx.fillStyle = color
  ctx.textBaseline = 'alphabetic'
  const width = ctx.measureText(text).width
  const start = align === 'center' ? -width / 2 : align === 'right' ? -width : 0
  ctx.translate(x, y)
  ctx.rotate(rot + (r() - 0.5) * 0.012)
  let cx = start
  for (const ch of text) {
    ctx.fillText(ch, cx, (r() - 0.5) * size * 0.06)
    cx += ctx.measureText(ch).width
  }
  ctx.restore()
  return width
}

// Wrapped handwriting; returns the y after the last line.
export function handBlock(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  maxW: number,
  o: HandOpts & { leading?: number } = {}
) {
  const size = o.size ?? 40
  const leading = o.leading ?? size * 1.15
  ctx.font = `${o.weight ?? 500} ${size}px ${FONT[o.font ?? 'hand']()}`
  const words = text.split(' ')
  let lineText = ''
  let cy = y
  for (const word of words) {
    const test = lineText ? `${lineText} ${word}` : word
    if (ctx.measureText(test).width > maxW && lineText) {
      hand(ctx, lineText, x, cy, o)
      lineText = word
      cy += leading
    } else lineText = test
  }
  if (lineText) hand(ctx, lineText, x, cy, o)
  return cy + leading
}

// A strip of embossed label-maker tape.
export function dymo(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  o: { color?: string; rot?: number; size?: number } = {}
) {
  const { color = '#b8322a', rot = -0.02, size = 34 } = o
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.font = `700 ${size}px ${FONT.mono()}`
  const label = text.toUpperCase().split('').join(' ')
  const w = ctx.measureText(label).width + size * 1.4
  const h = size * 1.75
  ctx.shadowColor = 'rgba(0,0,0,0.28)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 4
  ctx.fillStyle = color
  roundRect(ctx, 0, -h / 2, w, h, 6)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  // Glossy tape sheen
  const g = ctx.createLinearGradient(0, -h / 2, 0, h / 2)
  g.addColorStop(0, 'rgba(255,255,255,0.22)')
  g.addColorStop(0.45, 'rgba(255,255,255,0.02)')
  g.addColorStop(1, 'rgba(0,0,0,0.18)')
  ctx.fillStyle = g
  roundRect(ctx, 0, -h / 2, w, h, 6)
  ctx.fill()
  // Embossed letters: stressed white plastic with a shadow below
  ctx.textBaseline = 'middle'
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.fillText(label, size * 0.7, 2.5)
  ctx.fillStyle = 'rgba(255,255,255,0.93)'
  ctx.fillText(label, size * 0.7, 0)
  ctx.restore()
  return w
}

// Masking tape with torn ends.
export function tape(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  rot: number,
  color = 'rgba(232, 214, 168, 0.82)'
) {
  const h = 56
  const r = seeded(Math.round(x * 13 + y))
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.beginPath()
  ctx.moveTo(-w / 2, -h / 2)
  for (let i = 0; i <= 8; i++)
    ctx.lineTo(-w / 2 + (r() - 0.5) * 8, -h / 2 + (h * i) / 8)
  for (let i = 0; i <= 8; i++)
    ctx.lineTo(w / 2 + (r() - 0.5) * 8, h / 2 - (h * i) / 8)
  ctx.closePath()
  ctx.fillStyle = color
  ctx.shadowColor = 'rgba(0,0,0,0.12)'
  ctx.shadowBlur = 4
  ctx.fill()
  ctx.restore()
}

// An instant print, taped down at a slight angle.
export function polaroid(
  ctx: Ctx,
  src: string,
  x: number,
  y: number,
  w: number,
  rot: number,
  caption?: string
) {
  const pad = w * 0.06
  const ph = w * 0.8
  const h = ph + pad * 1 + w * 0.2
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.shadowColor = 'rgba(40, 30, 10, 0.35)'
  ctx.shadowBlur = 18
  ctx.shadowOffsetY = 8
  ctx.fillStyle = '#fbf9f3'
  ctx.fillRect(-w / 2, -h / 2, w, h)
  ctx.shadowColor = 'transparent'
  const img = image(src)
  const iw = w - pad * 2
  if (img?.width) {
    ctx.drawImage(img, -w / 2 + pad, -h / 2 + pad, iw, ph - pad)
    // A faded, warm print
    ctx.fillStyle = 'rgba(255, 220, 170, 0.12)'
    ctx.fillRect(-w / 2 + pad, -h / 2 + pad, iw, ph - pad)
  } else {
    ctx.fillStyle = '#d9d2c2'
    ctx.fillRect(-w / 2 + pad, -h / 2 + pad, iw, ph - pad)
  }
  if (caption)
    hand(ctx, caption, 0, h / 2 - w * 0.07, {
      size: w * 0.11,
      align: 'center',
      color: INK.pencil,
    })
  ctx.restore()
  tape(
    ctx,
    x + Math.sin(rot) * h * 0.5,
    y - Math.cos(rot) * h * 0.5,
    w * 0.42,
    rot + 0.05
  )
}

export function checkbox(
  ctx: Ctx,
  x: number,
  y: number,
  checked: boolean,
  size = 30
) {
  ctx.save()
  ctx.strokeStyle = INK.pen
  ctx.lineWidth = 2.6
  ctx.strokeRect(x, y - size, size, size)
  if (checked) {
    ctx.strokeStyle = INK.red
    ctx.lineWidth = 4
    ctx.beginPath()
    ctx.moveTo(x + 4, y - size * 0.45)
    ctx.lineTo(x + size * 0.42, y - 2)
    ctx.lineTo(x + size * 1.2, y - size * 1.25)
    ctx.stroke()
  }
  ctx.restore()
}

export function highlight(ctx: Ctx, x: number, y: number, w: number, h = 34) {
  ctx.save()
  ctx.fillStyle = INK.highlighter
  ctx.globalCompositeOperation = 'multiply'
  ctx.beginPath()
  ctx.moveTo(x, y - h * 0.7)
  ctx.lineTo(x + w, y - h * 0.8)
  ctx.lineTo(x + w + 4, y + h * 0.25)
  ctx.lineTo(x - 2, y + h * 0.3)
  ctx.fill()
  ctx.restore()
}

// A pen underline with a little overshoot.
export function underline(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  color = INK.red
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 3.5
  ctx.lineCap = 'round'
  ctx.beginPath()
  ctx.moveTo(x - 6, y + 2)
  ctx.quadraticCurveTo(x + w * 0.5, y - 5, x + w + 10, y + 3)
  ctx.stroke()
  ctx.restore()
}

export function arrow(
  ctx: Ctx,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  color = INK.red,
  bend = 40
) {
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.lineCap = 'round'
  const mx = (x1 + x2) / 2 + bend
  const my = (y1 + y2) / 2 - bend
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.quadraticCurveTo(mx, my, x2, y2)
  ctx.stroke()
  const a = Math.atan2(y2 - my, x2 - mx)
  ctx.beginPath()
  ctx.moveTo(x2 - Math.cos(a - 0.5) * 18, y2 - Math.sin(a - 0.5) * 18)
  ctx.lineTo(x2, y2)
  ctx.lineTo(x2 - Math.cos(a + 0.5) * 18, y2 - Math.sin(a + 0.5) * 18)
  ctx.stroke()
  ctx.restore()
}

// A round rubber stamp, unevenly inked.
export function stamp(
  ctx: Ctx,
  top: string,
  middle: string,
  x: number,
  y: number,
  radius: number,
  color: string,
  rot = -0.2
) {
  const r = seeded(Math.round(x + y * 3))
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.globalAlpha = 0.82
  ctx.strokeStyle = color
  ctx.fillStyle = color
  ctx.lineWidth = 5
  ctx.beginPath()
  ctx.arc(0, 0, radius, 0, Math.PI * 2)
  ctx.stroke()
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.arc(0, 0, radius - 12, 0, Math.PI * 2)
  ctx.stroke()
  ctx.font = `700 ${radius * 0.2}px ${FONT.mono()}`
  ctx.textAlign = 'center'
  const chars = top.toUpperCase().split('')
  const span = Math.min(Math.PI * 1.3, chars.length * 0.2)
  chars.forEach((ch, i) => {
    const a = -Math.PI / 2 - span / 2 + (span * (i + 0.5)) / chars.length
    ctx.save()
    ctx.rotate(a + Math.PI / 2)
    ctx.fillText(ch, 0, -radius + radius * 0.34)
    ctx.restore()
  })
  ctx.font = `800 ${radius * 0.42}px ${FONT.sans()}`
  ctx.textBaseline = 'middle'
  ctx.fillText(middle, 0, radius * 0.08)
  // Knock out some ink, as a real stamp leaves gaps
  ctx.globalCompositeOperation = 'destination-out'
  for (let i = 0; i < 140; i++) {
    ctx.globalAlpha = r() * 0.6
    ctx.beginPath()
    ctx.arc(
      (r() - 0.5) * radius * 2.2,
      (r() - 0.5) * radius * 2.2,
      r() * 5,
      0,
      Math.PI * 2
    )
    ctx.fill()
  }
  ctx.restore()
}

// Pencil ridgelines, for doodles in margins.
export function mountains(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  seed = 3
) {
  const r = seeded(seed)
  ctx.save()
  ctx.strokeStyle = INK.pencil
  ctx.lineWidth = 2.4
  ctx.lineJoin = 'round'
  ctx.beginPath()
  ctx.moveTo(x, y + h)
  const peaks = 4
  for (let i = 0; i < peaks; i++) {
    const px = x + (w * (i + 0.5)) / peaks + (r() - 0.5) * 30
    const py = y + r() * h * 0.5
    ctx.lineTo(px - 10, py + 16)
    ctx.lineTo(px, py)
    ctx.lineTo(px + 14, py + 22)
    ctx.lineTo(x + (w * (i + 1)) / peaks, y + h * (0.55 + r() * 0.35))
  }
  ctx.stroke()
  ctx.restore()
}

export function roundRect(
  ctx: Ctx,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}
