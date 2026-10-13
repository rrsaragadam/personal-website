// Where each part sits on the panel, in scene units (x across, z down the
// panel). Landscape is a wide dashboard; portrait stacks it for phones.
type Vec = [number, number, number]

export interface ConsoleLayout {
  panel: [number, number]
  tilt: number
  screen: { pos: Vec; size: [number, number]; px: number }
  selector: { pos: Vec; radius: number; label: Vec }
  gauge: { pos: Vec; radius: number }
  finish: { pos: Vec; radius: number; label: Vec }
  key: { pos: Vec; rotation: number }
  toggles: Vec[]
}

export const LANDSCAPE: ConsoleLayout = {
  panel: [6.6, 3.8],
  tilt: 1.18,
  screen: { pos: [-0.15, 0, -0.42], size: [3.4, 2.125], px: 840 },
  selector: { pos: [-2.55, 0, -0.6], radius: 0.55, label: [-2.55, 0, 0.3] },
  gauge: { pos: [2.35, 0, -0.85], radius: 0.45 },
  finish: { pos: [2.35, 0, 0.42], radius: 0.28, label: [2.35, 0, 1.02] },
  key: { pos: [-2.55, 0, 1.25], rotation: 0 },
  toggles: [-1.35, -0.55, 0.25, 1.05].map((x) => [x, 0, 1.3] as Vec),
}

export const PORTRAIT: ConsoleLayout = {
  panel: [3.8, 7.2],
  tilt: 1.3,
  screen: { pos: [0, 0, -1.9], size: [3.3, 2.9], px: 480 },
  selector: { pos: [-0.95, 0, 0.6], radius: 0.5, label: [-0.95, 0, 1.28] },
  gauge: { pos: [0.95, 0, 0.6], radius: 0.42 },
  finish: { pos: [-0.95, 0, 1.92], radius: 0.28, label: [-0.95, 0, 2.5] },
  key: { pos: [0.95, 0, 1.95], rotation: 0 },
  toggles: [-1.2, -0.4, 0.4, 1.2].map((x) => [x, 0, 2.95] as Vec),
}
