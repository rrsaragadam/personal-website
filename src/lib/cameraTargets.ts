export const CAMERA_TARGETS = {
  default: {
    pos: [0, 4.5, 11] as [number, number, number],
    lookAt: [0, 0.5, 0] as [number, number, number],
  },
  laptop: {
    pos: [-0.5, 2.5, 5] as [number, number, number],
    lookAt: [-0.5, 0.7, 0] as [number, number, number],
  },
  monitor: {
    pos: [0.5, 3, 4.5] as [number, number, number],
    lookAt: [0.5, 1, -0.5] as [number, number, number],
  },
  ipad: {
    pos: [2.1, 2.2, 4] as [number, number, number],
    lookAt: [2.1, 0.8, 0.1] as [number, number, number],
  },
  books: {
    pos: [-2.4, 2, 4.5] as [number, number, number],
    lookAt: [-2.4, 0.4, 0.3] as [number, number, number],
  },
} as const
