export const CAMERA_TARGETS = {
  default: {
    pos: [0, 1.95, 8.2] as [number, number, number],
    lookAt: [0, 0.05, -0.6] as [number, number, number],
  },
  laptop: {
    pos: [-0.35, 0.85, 2.3] as [number, number, number],
    lookAt: [-0.35, 0.55, 0] as [number, number, number],
  },
  monitor: {
    pos: [-0.2, 1.2, 2.7] as [number, number, number],
    lookAt: [-0.2, 0.75, -0.6] as [number, number, number],
  },
  ipad: {
    pos: [2.05, 0.9, 2.0] as [number, number, number],
    lookAt: [2.05, 0.55, -0.05] as [number, number, number],
  },
  books: {
    pos: [-2.2, 0.8, 2.0] as [number, number, number],
    lookAt: [-2.3, 0.45, 0.05] as [number, number, number],
  },
} as const
