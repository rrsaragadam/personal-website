// The cursor in normalised device coordinates (-1 → 1), eased, so objects
// can lean toward it without every component listening for events.
export const pointer = { x: 0, y: 0, tx: 0, ty: 0 }

let bound = false

export function trackPointer() {
  if (bound || typeof window === 'undefined') return
  bound = true
  window.addEventListener('pointermove', (e) => {
    pointer.tx = (e.clientX / window.innerWidth) * 2 - 1
    pointer.ty = -((e.clientY / window.innerHeight) * 2 - 1)
  })
}

export function easePointer(dt: number) {
  const k = 1 - Math.exp(-dt * 4)
  pointer.x += (pointer.tx - pointer.x) * k
  pointer.y += (pointer.ty - pointer.y) * k
}
