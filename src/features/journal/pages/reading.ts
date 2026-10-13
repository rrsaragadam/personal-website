import { BOOKS } from '@/content/books'
import { FONT, seeded } from '../canvas'
import { dymo, hand, handBlock, INK, paper, roundRect, tape } from '../ink'
import type { Page } from './types'

const UP_NEXT = ['The Overstory', 'A Pattern Language', 'Braiding Sweetgrass']

// The reading log: a row of hand-coloured spines, then each book with a
// rating and the line that stuck.
export const reading: Page = {
  text: `Reading log: ${BOOKS.map((b) => `${b.title} by ${b.author}`).join('; ')}.`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'lined', 61, 8)
    dymo(ctx, 'Reading', 90, 100, { color: '#2b5c8a' })
    // A little shelf of coloured-pencil spines
    const r = seeded(8)
    let sx = 520
    BOOKS.forEach((b) => {
      const sh = 120 + b.height
      ctx.save()
      ctx.globalAlpha = 0.85
      ctx.fillStyle = b.color
      ctx.translate(sx, 250)
      ctx.rotate((r() - 0.5) * 0.06)
      roundRect(ctx, 0, -sh, 64, sh, 6)
      ctx.fill()
      ctx.restore()
      sx += 76
    })
    ctx.strokeStyle = INK.pen
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(500, 252)
    ctx.lineTo(sx + 10, 250)
    ctx.stroke()

    let y = 360
    BOOKS.forEach((b, i) => {
      hand(ctx, b.title, 90, y, { size: 52, weight: 700 })
      hand(ctx, b.author, 90, y + 54, { size: 40, color: INK.pencil })
      stars(ctx, w - 100, y + 46, 5 - (i % 2))
      y += 150
    })
    hand(ctx, 'up next', 90, y + 40, {
      size: 56,
      weight: 700,
      color: INK.green,
    })
    y += 110
    for (const t of UP_NEXT) {
      hand(ctx, `○ ${t}`, 110, y, { size: 44, color: INK.green })
      y += 60
    }
  },
}

export const quotes: Page = {
  text: `Lines that stuck: ${BOOKS.map((b) => `“${b.thought}” on ${b.title}`).join(' ')}`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'lined', 62, 9)
    hand(ctx, 'lines that stuck', 90, 140, { size: 60, weight: 700 })
    let y = 255
    BOOKS.forEach((b, i) => {
      ctx.fillStyle = b.color
      ctx.globalAlpha = 0.9
      ctx.fillRect(90, y - 40, 10, 96)
      ctx.globalAlpha = 1
      y = handBlock(ctx, `“${b.thought}”`, 125, y, w - 240, {
        size: 44,
        leading: 52,
        rot: i % 2 ? 0.006 : -0.006,
      })
      y += 46
    })
    // A pressed fern on a scrap of the trail map
    ctx.save()
    ctx.translate(w - 280, h - 330)
    ctx.rotate(-0.12)
    ctx.fillStyle = '#efe4c8'
    ctx.shadowColor = 'rgba(40,30,10,0.3)'
    ctx.shadowBlur = 12
    ctx.fillRect(-170, -200, 340, 400)
    ctx.restore()
    fern(ctx, w - 280, h - 320)
    tape(ctx, w - 300, h - 520, 160, -0.12)
    ctx.font = `600 20px ${FONT.mono()}`
    ctx.fillStyle = INK.pencil
    ctx.fillText('PRESSED · PANORAMA RIDGE', w - 430, h - 110)
  },
}

function stars(ctx: CanvasRenderingContext2D, x: number, y: number, n: number) {
  ctx.save()
  ctx.font = `600 40px ${FONT.hand()}`
  ctx.textAlign = 'right'
  ctx.fillStyle = INK.red
  ctx.fillText('★'.repeat(n) + '☆'.repeat(5 - n), x, y)
  ctx.restore()
}

function fern(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(0.3)
  ctx.strokeStyle = '#4c6b3c'
  ctx.fillStyle = 'rgba(76, 107, 60, 0.85)'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(0, 180)
  ctx.quadraticCurveTo(10, 0, -10, -180)
  ctx.stroke()
  for (let i = 0; i < 16; i++) {
    const t = i / 16
    const py = 160 - t * 330
    const len = 70 * Math.sin(Math.PI * (0.15 + t * 0.85))
    for (const s of [-1, 1]) {
      ctx.beginPath()
      ctx.ellipse(s * len * 0.5, py, len * 0.5, 9, s * -0.35, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.restore()
}
