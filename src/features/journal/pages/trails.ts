import { TRAILS } from '@/content/trails'
import { FONT, seeded } from '../canvas'
import { dymo, hand, INK, line, paper, polaroid, stamp } from '../ink'
import type { Page } from './types'

const total = TRAILS.reduce((s, t) => s + t.km, 0)
const gain = TRAILS.reduce((s, t) => s + t.gain, 0)

// The trail log: a ruled table of hikes with running totals.
export const trailLog: Page = {
  images: ['/journal/photos/alps.jpg'],
  text: `Trail log: ${TRAILS.map((t) => `${t.name}, ${t.km} km, ${t.gain} m gain`).join('; ')}. Season total ${total} km.`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'grid', 71, 10)
    dymo(ctx, 'Trails', 90, 100, { color: '#8a3b4d' })
    hand(ctx, 'season 2026', w - 100, 112, {
      size: 46,
      align: 'right',
      color: INK.pencil,
    })
    ctx.font = `700 22px ${FONT.mono()}`
    ctx.fillStyle = INK.pencil
    const cols = [90, 230, w - 270, w - 140]
    ;['DATE', 'TRAIL', 'KM', 'GAIN'].forEach((c, i) =>
      ctx.fillText(c, cols[i], 230)
    )
    ctx.strokeStyle = INK.pen
    ctx.lineWidth = 2.5
    line(ctx, 80, 250, w - 80, 252)
    let y = 330
    for (const t of TRAILS) {
      hand(ctx, t.date, cols[0], y, { size: 44, color: INK.pencil })
      hand(ctx, t.name, cols[1], y, { size: 46 })
      hand(ctx, String(t.km), cols[2], y, { size: 46 })
      hand(ctx, `${t.gain}m`, cols[3], y, { size: 46 })
      y += 76
    }
    line(ctx, 80, y - 40, w - 80, y - 38)
    hand(ctx, 'total', cols[1], y + 20, {
      size: 50,
      weight: 700,
      color: INK.red,
    })
    hand(ctx, String(total), cols[2], y + 20, {
      size: 50,
      weight: 700,
      color: INK.red,
    })
    hand(ctx, `${gain}m`, cols[3], y + 20, {
      size: 50,
      weight: 700,
      color: INK.red,
    })
    polaroid(
      ctx,
      '/journal/photos/alps.jpg',
      330,
      h - 420,
      440,
      -0.07,
      'the one that got away'
    )
    stamp(ctx, 'Summit club', '12', w - 220, h - 300, 120, '#2f5d46', 0.2)
  },
}

// A hand-drawn topo map of the last big day, with an elevation profile.
export const trailMap: Page = {
  images: ['/journal/photos/mesa.jpg'],
  text: `Map of ${TRAILS[1].name}: ${TRAILS[1].km} km, ${TRAILS[1].gain} m of climbing.`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'plain', 72, 11)
    hand(ctx, TRAILS[1].name, 90, 140, { size: 66, weight: 700 })
    hand(
      ctx,
      `${TRAILS[1].km} km · ${TRAILS[1].gain} m up · worth it`,
      90,
      200,
      {
        size: 42,
        color: INK.pencil,
      }
    )
    // Contour lines around two summits
    const r = seeded(12)
    const peaks = [
      { x: 360, y: 560, s: 1 },
      { x: 700, y: 430, s: 0.75 },
    ]
    ctx.lineWidth = 2
    for (const p of peaks) {
      for (let i = 1; i <= 9; i++) {
        ctx.strokeStyle =
          i % 4 === 0 ? 'rgba(139, 90, 43, 0.75)' : 'rgba(139, 90, 43, 0.38)'
        ctx.beginPath()
        for (let a = 0; a <= Math.PI * 2 + 0.01; a += 0.15) {
          const rad =
            i *
            26 *
            p.s *
            (1 + 0.18 * Math.sin(a * 3 + i * 0.4) + (r() - 0.5) * 0.04)
          const px = p.x + Math.cos(a) * rad * 1.25
          const py = p.y + Math.sin(a) * rad
          if (a === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }
        ctx.stroke()
      }
    }
    // A lake, and the dashed route over the ridge
    ctx.fillStyle = 'rgba(80, 140, 190, 0.45)'
    ctx.beginPath()
    ctx.ellipse(200, 860, 120, 60, -0.3, 0, Math.PI * 2)
    ctx.fill()
    ctx.strokeStyle = INK.red
    ctx.lineWidth = 5
    ctx.setLineDash([16, 12])
    ctx.beginPath()
    ctx.moveTo(110, 1000)
    ctx.bezierCurveTo(260, 900, 300, 700, 360, 560)
    ctx.bezierCurveTo(450, 470, 600, 520, 700, 430)
    ctx.stroke()
    ctx.setLineDash([])
    for (const [x, y] of [
      [360, 560],
      [700, 430],
    ]) {
      ctx.fillStyle = INK.red
      ctx.beginPath()
      ctx.moveTo(x, y - 22)
      ctx.lineTo(x + 18, y + 10)
      ctx.lineTo(x - 18, y + 10)
      ctx.fill()
    }
    hand(ctx, 'camp?', 160, 960, { size: 40, color: INK.pen })
    hand(ctx, 'the view!!', 730, 380, { size: 42, color: INK.red })
    // North arrow
    ctx.strokeStyle = INK.pen
    ctx.lineWidth = 3
    line(ctx, w - 110, 340, w - 110, 260)
    ctx.font = `700 30px ${FONT.mono()}`
    ctx.fillStyle = INK.pen
    ctx.fillText('N', w - 121, 250)

    // Elevation profile
    const top = 1130
    const base = 1340
    ctx.strokeStyle = INK.pencil
    ctx.lineWidth = 2
    line(ctx, 90, base, w - 90, base)
    ctx.fillStyle = 'rgba(139, 90, 43, 0.18)'
    ctx.strokeStyle = INK.pen
    ctx.lineWidth = 3.5
    ctx.beginPath()
    ctx.moveTo(90, base)
    const pts = 40
    for (let i = 0; i <= pts; i++) {
      const t = i / pts
      const e =
        Math.sin(t * Math.PI) * 0.8 +
        Math.sin(t * Math.PI * 3) * 0.12 +
        (r() - 0.5) * 0.04
      ctx.lineTo(90 + t * (w - 180), base - e * (base - top))
    }
    ctx.lineTo(w - 90, base)
    ctx.fill()
    ctx.stroke()
    ctx.font = `600 20px ${FONT.mono()}`
    ctx.fillStyle = INK.pencil
    ctx.fillText('0 KM', 90, base + 34)
    ctx.fillText(`${TRAILS[1].km} KM`, w - 160, base + 34)
    polaroid(
      ctx,
      '/journal/photos/mesa.jpg',
      w - 250,
      830,
      330,
      0.09,
      'golden hour'
    )
  },
}
