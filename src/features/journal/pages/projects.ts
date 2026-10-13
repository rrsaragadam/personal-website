import { PROJECTS, type Project } from '@/content/projects'
import { FONT } from '../canvas'
import {
  arrow,
  dymo,
  hand,
  handBlock,
  INK,
  paper,
  roundRect,
  tape,
} from '../ink'
import type { Page, Spot } from './types'

// Two pages of project notes: each one gets a taped-in "screen" in its own
// colours, a few lines in pen, stamped tags and a link.
export const projectsLeft: Page = {
  text: projectText(PROJECTS.slice(0, 1)),
  paint: (ctx, w, h, spots) => {
    paper(ctx, w, h, 'dot', 41, 4)
    dymo(ctx, 'Projects', 90, 100, { color: '#c38d1e' })
    entry(ctx, PROJECTS[0], 90, 230, w - 180, spots, 0.03)
    // Margin sketch: the wireframe that started it
    ctx.save()
    ctx.strokeStyle = INK.pencil
    ctx.lineWidth = 2.5
    ctx.strokeRect(110, h - 470, 360, 250)
    ctx.strokeRect(130, h - 450, 140, 100)
    for (let i = 0; i < 4; i++) {
      ctx.beginPath()
      ctx.moveTo(290, h - 440 + i * 26)
      ctx.lineTo(450 - i * 30, h - 440 + i * 26)
      ctx.stroke()
    }
    ctx.restore()
    hand(ctx, 'v0.1 — the idea on a napkin', 110, h - 170, {
      size: 40,
      color: INK.pencil,
    })
    arrow(ctx, 640, h - 260, 480, h - 360, INK.red, 30)
    hand(ctx, 'it became this site!', 560, h - 210, {
      size: 44,
      color: INK.red,
      rot: -0.05,
    })
  },
}

export const projectsRight: Page = {
  text: projectText(PROJECTS.slice(1)),
  paint: (ctx, w, h, spots) => {
    paper(ctx, w, h, 'dot', 42, 5)
    let y = 140
    PROJECTS.slice(1).forEach((p, i) => {
      y = entry(ctx, p, 90, y, w - 180, spots, i % 2 ? 0.035 : -0.03) + 80
    })
  },
}

function projectText(list: Project[]) {
  return list
    .map(
      (p) => `${p.title} (${p.year}): ${p.description} ${p.tags.join(', ')}.`
    )
    .join(' ')
}

function entry(
  ctx: CanvasRenderingContext2D,
  p: Project,
  x: number,
  y: number,
  width: number,
  spots: Spot[],
  rot: number
) {
  // The "screen": a printout in the project's colour, taped in
  const sw = 380
  const sh = 250
  ctx.save()
  ctx.translate(x + sw / 2, y + sh / 2)
  ctx.rotate(rot)
  ctx.shadowColor = 'rgba(40,30,10,0.3)'
  ctx.shadowBlur = 14
  ctx.shadowOffsetY = 6
  const g = ctx.createLinearGradient(-sw / 2, -sh / 2, sw / 2, sh / 2)
  g.addColorStop(0, p.finish)
  g.addColorStop(1, shade(p.finish))
  ctx.fillStyle = g
  roundRect(ctx, -sw / 2, -sh / 2, sw, sh, 14)
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.font = `800 34px ${FONT.sans()}`
  ctx.fillText(p.title.split(' ')[0], -sw / 2 + 28, -sh / 2 + 62)
  ctx.fillStyle = 'rgba(255,255,255,0.35)'
  for (let i = 0; i < 3; i++)
    roundRect(ctx, -sw / 2 + 28, -sh / 2 + 100 + i * 34, 220 - i * 50, 14, 7)
  ctx.fill()
  ctx.restore()
  tape(ctx, x + 40, y + 10, 130, -0.6)
  tape(ctx, x + sw - 30, y + sh - 10, 130, -0.6)

  // Notes beside it
  const nx = x + sw + 40
  hand(ctx, p.year, nx, y + 50, { size: 42, color: INK.pencil })
  handBlock(ctx, p.title, nx, y + 120, width - sw - 40, {
    size: 60,
    weight: 700,
    leading: 62,
  })
  let cy = handBlock(ctx, p.description, x, y + sh + 80, width, {
    size: 44,
    leading: 50,
  })
  ctx.font = `700 22px ${FONT.mono()}`
  let tx = x
  for (const tag of p.tags) {
    const tw = ctx.measureText(tag.toUpperCase()).width + 28
    ctx.strokeStyle = 'rgba(29,39,65,0.7)'
    ctx.lineWidth = 2
    roundRect(ctx, tx, cy - 26, tw, 40, 20)
    ctx.stroke()
    ctx.fillStyle = 'rgba(29,39,65,0.8)'
    ctx.fillText(tag.toUpperCase(), tx + 14, cy + 2)
    tx += tw + 14
  }
  const lw = hand(ctx, 'open it →', x + width, cy + 6, {
    size: 46,
    color: INK.red,
    align: 'right',
  })
  spots.push({
    x: x + width - lw - 10,
    y: cy - 40,
    w: lw + 20,
    h: 60,
    action: { type: 'link', href: p.href },
  })
  cy += 60
  return cy
}

function shade(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => Math.round(v * 0.55)
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`
}
