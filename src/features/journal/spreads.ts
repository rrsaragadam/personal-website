import { cover } from './pages/cover'
import { contents, insideCover } from './pages/front'
import { now, systems } from './pages/now'
import { projectsLeft, projectsRight } from './pages/projects'
import { toolkit, work } from './pages/work'
import { quotes, reading } from './pages/reading'
import { trailLog, trailMap } from './pages/trails'
import { bucket, contact, insideBack } from './pages/end'
import type { Page } from './pages/types'

// What you see with the journal open at each spread.
export const SPREADS: { left: Page; right: Page }[] = [
  { left: insideCover, right: contents },
  { left: now, right: systems },
  { left: projectsLeft, right: projectsRight },
  { left: work, right: toolkit },
  { left: reading, right: quotes },
  { left: trailLog, right: trailMap },
  { left: bucket, right: contact },
]

// The same content as physical leaves: each leaf's front is a right-hand
// page and its back is the next spread's left-hand page. Leaf 0 is the
// cover.
export const LEAVES: { front: Page; back: Page }[] = [
  { front: cover, back: SPREADS[0].left },
  ...SPREADS.map((s, i) => ({
    front: s.right,
    back: SPREADS[i + 1]?.left ?? insideBack,
  })),
]
