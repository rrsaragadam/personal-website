// Shared scroll state for the DOM and the 3D stage. Each act is a tall
// section with a sticky frame inside; its progress runs 0 → 1 while that
// frame is pinned, so the stage can play one beat per stretch of scroll.

export const scroll = { y: 0, vh: 1 }

const acts = new Map<string, HTMLElement>()
const spans = new Map<string, { start: number; length: number }>()

export function registerAct(id: string, el: HTMLElement | null) {
  if (el) acts.set(id, el)
  else acts.delete(id)
  measure()
}

export function measure() {
  scroll.vh = window.innerHeight
  acts.forEach((el, id) => {
    const top = el.getBoundingClientRect().top + window.scrollY
    spans.set(id, {
      start: top,
      length: Math.max(1, el.offsetHeight - window.innerHeight),
    })
  })
}

// 0 → 1 while the act is pinned; below 0 before it arrives, above 1 after.
export function progress(id: string) {
  const s = spans.get(id)
  if (!s) return -1
  return (scroll.y - s.start) / s.length
}

// How far the act's frame is from the centre of the viewport, in screens:
// -1 a screen below, 0 pinned, +1 a screen above.
export function offset(id: string) {
  const s = spans.get(id)
  if (!s) return -1
  const y = scroll.y - s.start
  if (y < 0) return y / scroll.vh
  if (y > s.length) return (y - s.length) / scroll.vh
  return 0
}

export const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

// Smoothstep between two edges, for easing beats in and out.
export function ramp(v: number, a: number, b: number) {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
