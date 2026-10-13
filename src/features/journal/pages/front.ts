import { PROFILE } from '@/content/profile'
import { FONT } from '../canvas'
import {
  arrow,
  dymo,
  hand,
  handBlock,
  INK,
  line,
  mountains,
  paper,
  underline,
} from '../ink'
import { SECTIONS } from '../sections'
import type { Page } from './types'

const email = PROFILE.links.find((l) => l.href.startsWith('mailto:'))

// Inside the front cover: the "if found" block every field notebook has.
export const insideCover: Page = {
  text: `If found, please return to ${PROFILE.name}. ${email?.href.replace('mailto:', '')}. Reward: a good coffee and trail stories.`,
  paint: (ctx, w, h, spots) => {
    paper(ctx, w, h, 'plain', 21)
    ctx.fillStyle = '#2a2622'
    ctx.font = `700 26px ${FONT.mono()}`
    ctx.fillText('IF FOUND, PLEASE RETURN TO:', 90, 200)
    ctx.strokeStyle = 'rgba(40,40,40,0.5)'
    ctx.lineWidth = 2
    for (let y = 300; y <= 540; y += 80) line(ctx, 90, y, w - 90, y)
    hand(ctx, PROFILE.name, 100, 285, { size: 70 })
    const address = email?.href.replace('mailto:', '') ?? ''
    const aw = hand(ctx, address, 100, 365, { size: 54, color: INK.pen })
    spots.push({
      x: 90,
      y: 315,
      w: aw + 30,
      h: 70,
      action: { type: 'link', href: email?.href ?? '#' },
    })
    hand(ctx, PROFILE.role + ' · usually outside', 100, 445, { size: 54 })
    hand(ctx, 'Reward: a good coffee + trail stories', 100, 525, {
      size: 50,
      color: INK.red,
    })

    ctx.fillStyle = '#2a2622'
    ctx.font = `700 22px ${FONT.mono()}`
    ctx.fillText('HOW TO USE THIS BOOK', 90, 720)
    handBlock(
      ctx,
      'Everything lives in here: what I’m making, reading, climbing and thinking about. Pull a tab or flip a page. Nothing is finished.',
      90,
      790,
      w - 180,
      { size: 50, color: INK.pencil }
    )
    mountains(ctx, 90, h - 360, w - 180, 170, 9)
    hand(ctx, '— R.', w - 120, h - 120, { size: 64, align: 'right' })
  },
}

// The first right-hand page: an index of the tabs.
export const contents: Page = {
  text: `Index: ${SECTIONS.map((s) => s.title).join(', ')}.`,
  paint: (ctx, w, h, spots) => {
    paper(ctx, w, h, 'dot', 22, 1)
    dymo(ctx, 'Index', 90, 150)
    let y = 330
    SECTIONS.forEach((s, i) => {
      const label = `${String(i + 1).padStart(2, '0')}  ${s.title}`
      const lw = hand(ctx, label, 100, y, { size: 62 })
      ctx.save()
      ctx.strokeStyle = 'rgba(29,39,65,0.5)'
      ctx.setLineDash([2, 12])
      ctx.lineWidth = 3
      line(ctx, 120 + lw, y - 10, w - 190, y - 10)
      ctx.restore()
      hand(ctx, `p.${String(s.spread * 2 - 2).padStart(2, '0')}`, w - 100, y, {
        size: 52,
        align: 'right',
        color: INK.pencil,
      })
      ctx.fillStyle = s.color
      ctx.fillRect(70, y - 42, 12, 48)
      spots.push({
        x: 60,
        y: y - 70,
        w: w - 120,
        h: 100,
        action: { type: 'spread', to: s.spread },
      })
      y += 128
    })
    underline(ctx, 100, 345, 210)
    hand(ctx, 'start here!', 560, y + 70, {
      size: 52,
      color: INK.red,
      rot: -0.06,
    })
    arrow(ctx, 540, y + 50, 330, 360, INK.red, -60)
  },
}
