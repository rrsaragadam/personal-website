import { PROFILE } from '@/content/profile'
import { BUCKET, PACK } from '@/content/trails'
import { FONT } from '../canvas'
import {
  arrow,
  checkbox,
  dymo,
  hand,
  handBlock,
  INK,
  kraft,
  paper,
  polaroid,
  stamp,
  underline,
} from '../ink'
import type { Page } from './types'

export const bucket: Page = {
  images: ['/journal/photos/valley.jpg'],
  text: `Bucket list: ${BUCKET.map((b) => `${b.text}${b.done ? ' (done)' : ''}`).join(', ')}. Pack list: ${PACK.join(', ')}.`,
  paint: (ctx, w, h) => {
    paper(ctx, w, h, 'dot', 81, 12)
    dymo(ctx, 'Someday', 90, 100, { color: '#5b4a8a' })
    let y = 250
    for (const b of BUCKET) {
      checkbox(ctx, 96, y, b.done)
      hand(ctx, b.text, 150, y, { size: 50 })
      y += 84
    }
    y += 60
    hand(ctx, 'always in the pack', 90, y, {
      size: 56,
      weight: 700,
      color: INK.green,
    })
    y += 80
    for (const item of PACK) {
      hand(ctx, `– ${item}`, 110, y, { size: 46, color: INK.green })
      y += 60
    }
    polaroid(
      ctx,
      '/journal/photos/valley.jpg',
      w - 290,
      h - 330,
      380,
      -0.05,
      'next year?'
    )
  },
}

// The last page: how to reach me, written like a note to whoever finds it.
export const contact: Page = {
  text: `Say hi. ${PROFILE.links.map((l) => `${l.label}: ${l.href}`).join(', ')}.`,
  paint: (ctx, w, h, spots) => {
    paper(ctx, w, h, 'lined', 82, 13)
    hand(ctx, 'Say hi!', 90, 190, { size: 110, weight: 700, font: 'marker' })
    underline(ctx, 96, 220, 340)
    handBlock(
      ctx,
      'If you made it this far, we should probably go for a hike. Or build something. Ideally both.',
      90,
      320,
      w - 180,
      { size: 48, leading: 52 }
    )
    let y = 640
    for (const link of PROFILE.links) {
      const label = link.href.startsWith('mailto:')
        ? link.href.replace('mailto:', '')
        : link.href.replace('https://', '')
      ctx.font = `700 22px ${FONT.mono()}`
      ctx.fillStyle = INK.pencil
      ctx.fillText(link.label.toUpperCase(), 100, y - 54)
      const lw = hand(ctx, label, 100, y, { size: 54, color: INK.pen })
      underline(ctx, 100, y + 12, lw, 'rgba(29,39,65,0.5)')
      spots.push({
        x: 80,
        y: y - 90,
        w: lw + 60,
        h: 120,
        action: { type: 'link', href: link.href },
      })
      y += 160
    }
    arrow(ctx, w - 160, 760, w - 260, 640, INK.red, 40)
    hand(ctx, 'tap me', w - 210, 820, { size: 44, color: INK.red, rot: 0.05 })
    stamp(ctx, 'Return to sender', 'RS', w - 220, h - 260, 130, '#b8322a', -0.2)
  },
}

// Inside the back cover: kraft, a few spare stickers and nothing else.
export const insideBack: Page = {
  text: '',
  paint: (ctx, w, h) => {
    kraft(ctx, w, h, 91)
    ctx.fillStyle = 'rgba(27, 23, 18, 0.8)'
    ctx.font = `700 22px ${FONT.mono()}`
    ctx.fillText('MADE BY HAND, MOSTLY OUTDOORS.', 90, h - 120)
  },
}
