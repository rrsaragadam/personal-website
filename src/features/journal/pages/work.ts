import { WORK } from '@/content/work'
import {
  checkbox,
  dymo,
  hand,
  handBlock,
  highlight,
  INK,
  paper,
  stamp,
} from '../ink'
import type { Page } from './types'

const TOOLKIT = [
  { text: 'Figma (daily)', done: true },
  { text: 'React + Next.js', done: true },
  { text: 'Three.js / R3F', done: true },
  { text: 'Framer + GSAP motion', done: true },
  { text: 'Swift (learning)', done: false },
]

const PRINCIPLES = [
  'Less, but better.',
  'Make it feel inevitable.',
  'Prototype > presentation.',
]

// A hand-ruled timeline of roles, with the dates in pencil.
export const work: Page = {
  text: `Work: ${WORK.map((w) => `${w.role} at ${w.company}, ${w.period}. ${w.description}`).join(' ')}`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'grid', 51, 6)
    dymo(ctx, 'Work', 90, 100, { color: '#3f6b4a' })
    const lx = 130
    ctx.strokeStyle = INK.pen
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(lx, 220)
    ctx.lineTo(lx + 4, 220 + WORK.length * 400 - 160)
    ctx.stroke()
    WORK.forEach((job, i) => {
      const y = 260 + i * 400
      ctx.fillStyle = i === 0 ? INK.red : INK.pen
      ctx.beginPath()
      ctx.arc(lx + 2, y - 14, 14, 0, Math.PI * 2)
      ctx.fill()
      hand(ctx, job.period, 180, y, { size: 40, color: INK.pencil })
      const cw = hand(ctx, job.company, 180, y + 78, { size: 74, weight: 700 })
      if (i === 0) highlight(ctx, 176, y + 66, cw + 10, 44)
      hand(ctx, job.role, 180, y + 136, { size: 46, color: INK.red })
      handBlock(ctx, job.description, 180, y + 196, w - 280, {
        size: 40,
        leading: 46,
      })
    })
  },
}

export const toolkit: Page = {
  text: `Toolkit: ${TOOLKIT.map((t) => t.text).join(', ')}. Principles: ${PRINCIPLES.join(' ')}`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'grid', 52, 7)
    hand(ctx, 'toolkit', 90, 150, { size: 64, weight: 700 })
    let y = 250
    for (const t of TOOLKIT) {
      checkbox(ctx, 96, y, t.done)
      hand(ctx, t.text, 150, y, { size: 48 })
      y += 76
    }
    y += 80
    hand(ctx, 'principles', 90, y, { size: 64, weight: 700 })
    y += 100
    PRINCIPLES.forEach((p, i) => {
      hand(ctx, `${i + 1}. ${p}`, 110, y, {
        size: 54,
        color: INK.green,
        rot: -0.01,
      })
      y += 86
    })
    stamp(
      ctx,
      'Approved by future me',
      'OK',
      w - 220,
      h - 260,
      130,
      '#b8322a',
      0.18
    )
  },
}
