import { GOALS, HABITS, NOW, WEEKLY } from '@/content/now'
import { PROFILE } from '@/content/profile'
import { FONT, seeded } from '../canvas'
import {
  checkbox,
  dymo,
  hand,
  handBlock,
  highlight,
  INK,
  paper,
  polaroid,
} from '../ink'
import type { Page } from './types'

export const now: Page = {
  images: ['/journal/photos/golden.jpg'],
  text: `Now (${NOW.updated}): ${NOW.items.map((i) => `${i.label} ${i.text}`).join('; ')}. ${PROFILE.bio.join(' ')}`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'lined', 31, 2)
    dymo(ctx, 'Now', 90, 100, { color: '#1f1f22' })
    hand(ctx, NOW.updated, w - 100, 112, {
      size: 46,
      align: 'right',
      color: INK.pencil,
    })
    let y = 255
    for (const item of NOW.items) {
      hand(ctx, `${item.label}:`, 90, y, {
        size: 46,
        color: INK.red,
        weight: 700,
      })
      handBlock(ctx, item.text, 300, y, w - 400, { size: 46, leading: 52 })
      y += 104
    }
    highlight(ctx, 296, 255 + 104 * 3 - 8, 470)
    polaroid(
      ctx,
      '/journal/photos/golden.jpg',
      w - 330,
      h - 430,
      420,
      0.06,
      'morning loop'
    )
    handBlock(ctx, PROFILE.intro, 90, h - 470, 360, {
      size: 44,
      color: INK.pencil,
      leading: 50,
    })
  },
}

// A life system on one page: a habit grid for the week, goals for the year
// and the questions for a Sunday review.
export const systems: Page = {
  text: `Systems. Daily habits: ${HABITS.join(', ')}. Goals for 2026: ${GOALS.map((g) => `${g.text}${g.done ? ' (done)' : ''}`).join(', ')}. Weekly review: ${WEEKLY.join(' ')}`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'grid', 32, 3)
    dymo(ctx, 'Systems', 90, 100, { color: '#2b5c8a' })

    // Habit tracker: seven days across, a row per habit
    const r = seeded(4)
    const x0 = 300
    const cell = 82
    ctx.font = `700 22px ${FONT.mono()}`
    ctx.fillStyle = INK.pencil
    'MTWTFSS'
      .split('')
      .forEach((d, i) => ctx.fillText(d, x0 + i * cell + 30, 230))
    HABITS.forEach((habit, row) => {
      const y = 300 + row * cell
      hand(ctx, habit, 90, y + 14, { size: 44 })
      for (let d = 0; d < 7; d++) {
        const cx = x0 + d * cell + 36
        ctx.strokeStyle = 'rgba(29,39,65,0.55)'
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.arc(cx, y, 24, 0, Math.PI * 2)
        ctx.stroke()
        if (r() < 0.68 || d < 2) {
          ctx.fillStyle = [
            '#e2763a',
            '#2b5c8a',
            '#3f6b4a',
            '#d9b44a',
            '#c86d7f',
          ][row]
          ctx.globalAlpha = 0.85
          ctx.beginPath()
          ctx.arc(cx + (r() - 0.5) * 4, y + (r() - 0.5) * 4, 19, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        }
      }
    })

    let y = 300 + HABITS.length * cell + 90
    hand(ctx, '2026 goals', 90, y, { size: 58, weight: 700 })
    y += 80
    for (const goal of GOALS) {
      checkbox(ctx, 96, y, goal.done)
      const gw = hand(ctx, goal.text, 150, y, {
        size: 46,
        color: goal.done ? INK.pencil : INK.pen,
      })
      if (goal.done) {
        ctx.strokeStyle = INK.pencil
        ctx.lineWidth = 2.5
        ctx.beginPath()
        ctx.moveTo(146, y - 14)
        ctx.lineTo(160 + gw, y - 18)
        ctx.stroke()
      }
      y += 68
    }
    y += 40
    hand(ctx, 'sunday review', 90, y, {
      size: 50,
      weight: 700,
      color: INK.green,
    })
    y += 64
    for (const q of WEEKLY) {
      hand(ctx, `→ ${q}`, 110, y, { size: 42, color: INK.green })
      y += 56
    }
  },
}
