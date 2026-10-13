import { PROFILE } from '@/content/profile'
import { FONT, seeded } from '../canvas'
import { hand, INK, kraft, line, roundRect, stamp, tape } from '../ink'
import type { Page } from './types'

// The kraft cover, carried for a year: a printed masthead, a filled-in
// date box, stickers from trips and a coffee ring.
export const cover: Page = {
  text: `${PROFILE.name}: Field Log, Vol. 07`,
  paint: (ctx, w, h) => {
    kraft(ctx, w, h, 11)

    // Printed masthead, in heavy black ink
    ctx.fillStyle = '#1b1712'
    ctx.font = `900 118px ${FONT.sans()}`
    ctx.fillText('FIELD', 78, 210)
    ctx.fillText('LOG', 78, 322)
    ctx.font = `600 24px ${FONT.mono()}`
    ctx.fillText('VOL. 07  —  48 PAGES  —  GRAPH / DOT', 82, 372)
    ctx.lineWidth = 3
    ctx.strokeStyle = '#1b1712'
    line(ctx, 82, 398, w - 82, 398)

    // Printed date box, filled in by hand
    ctx.lineWidth = 2
    ctx.strokeRect(82, h - 330, w - 164, 230)
    line(ctx, 82, h - 255, w - 82, h - 255)
    line(ctx, 82, h - 178, w - 82, h - 178)
    ctx.font = `600 20px ${FONT.mono()}`
    ctx.fillText('NAME', 100, h - 290)
    ctx.fillText('FROM', 100, h - 212)
    ctx.fillText('TO', 100, h - 135)
    hand(ctx, PROFILE.name, 230, h - 278, { size: 62, color: INK.pen })
    hand(ctx, 'Jan 2026', 230, h - 200, { size: 56, color: INK.pen })
    hand(ctx, 'still going…', 230, h - 122, { size: 56, color: INK.pen })

    // Stickers from the road
    trailSticker(ctx, w - 230, 640)
    stamp(ctx, 'Est. 1994 — trail miles', 'RS', 250, 760, 120, '#2f5d46', -0.25)
    pill(ctx, 'HIKE MORE, SCROLL LESS', 140, 1000, -0.06)
    dotSticker(ctx, w - 150, 960, '#e2552c')
    dotSticker(ctx, w - 105, 1015, '#2d6fa3')
    tape(ctx, w - 70, 90, 220, 0.75, 'rgba(110, 160, 140, 0.75)')

    coffeeRing(ctx, w - 260, h - 520, 120)
  },
}

function trailSticker(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const r = 150
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(0.12)
  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = 10
  ctx.shadowOffsetY = 4
  ctx.fillStyle = '#f4ecd8'
  ctx.beginPath()
  ctx.arc(0, 0, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  // Sunset sky and two ranges of mountains
  ctx.save()
  ctx.beginPath()
  ctx.arc(0, 0, r - 14, 0, Math.PI * 2)
  ctx.clip()
  const sky = ctx.createLinearGradient(0, -r, 0, r)
  sky.addColorStop(0, '#f6b04a')
  sky.addColorStop(0.55, '#e8643a')
  sky.addColorStop(1, '#9c3b39')
  ctx.fillStyle = sky
  ctx.fillRect(-r, -r, r * 2, r * 2)
  ctx.fillStyle = '#f9e3a6'
  ctx.beginPath()
  ctx.arc(30, -10, 36, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#5b3a52'
  ctx.beginPath()
  ctx.moveTo(-r, 40)
  ctx.lineTo(-60, -40)
  ctx.lineTo(-10, 20)
  ctx.lineTo(50, -50)
  ctx.lineTo(r, 50)
  ctx.lineTo(r, r)
  ctx.lineTo(-r, r)
  ctx.fill()
  ctx.fillStyle = '#2f3d3a'
  ctx.beginPath()
  ctx.moveTo(-r, 90)
  ctx.lineTo(-30, 30)
  ctx.lineTo(40, 80)
  ctx.lineTo(r, 40)
  ctx.lineTo(r, r)
  ctx.lineTo(-r, r)
  ctx.fill()
  ctx.restore()
  ctx.fillStyle = '#f4ecd8'
  ctx.font = `800 26px ${FONT.sans()}`
  ctx.textAlign = 'center'
  ctx.fillText('GO OUTSIDE', 0, r - 40)
  ctx.restore()
}

function pill(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  rot: number
) {
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rot)
  ctx.font = `800 30px ${FONT.sans()}`
  const w = ctx.measureText(text).width + 56
  ctx.shadowColor = 'rgba(0,0,0,0.3)'
  ctx.shadowBlur = 8
  ctx.shadowOffsetY = 3
  ctx.fillStyle = '#1f3b33'
  roundRect(ctx, 0, -32, w, 64, 32)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.fillStyle = '#f2d16b'
  ctx.textBaseline = 'middle'
  ctx.fillText(text, 28, 2)
  ctx.restore()
}

function dotSticker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  color: string
) {
  ctx.save()
  ctx.shadowColor = 'rgba(0,0,0,0.25)'
  ctx.shadowBlur = 5
  ctx.shadowOffsetY = 2
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, 30, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function coffeeRing(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number
) {
  const rnd = seeded(5)
  ctx.save()
  ctx.strokeStyle = 'rgba(95, 55, 20, 0.22)'
  for (let i = 0; i < 3; i++) {
    ctx.lineWidth = 3 + rnd() * 5
    ctx.beginPath()
    ctx.arc(
      x + rnd() * 4,
      y + rnd() * 4,
      r - i * 4,
      rnd() * 0.6,
      Math.PI * 1.7 + rnd()
    )
    ctx.stroke()
  }
  ctx.restore()
}
