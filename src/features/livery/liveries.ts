// Each livery is a full "paint to sample" spec: the 3D finish plus the page
// gradient and ink it implies. Picking one repaints both the object and the
// page, the way a configurator repaints the car and the room around it.
export interface Livery {
  id: string
  name: string
  code: string
  paint: string // base coat of the hero object
  sheen: string // secondary light colour reflected in the clearcoat
  metalness: number
  gradient: [string, string, string, string] // backdrop blobs, back to front
  canvas: string // page base colour under the gradient
  ink: string // primary text colour
  accent: [string, string] // highlight type and details; must read on canvas
  dark: boolean
}

export const LIVERIES: Livery[] = [
  {
    id: 'lava',
    name: 'Lava Orange',
    code: 'L2B',
    paint: '#ff5b1f',
    sheen: '#ffd27a',
    metalness: 0.35,
    gradient: ['#ff8a3d', '#ff4d6d', '#ffc46b', '#ffe3c2'],
    canvas: '#fff4ea',
    ink: '#1c0f0a',
    accent: ['#ff5b1f', '#ff4d6d'],
    dark: false,
  },
  {
    id: 'gulf',
    name: 'Gulf Blue',
    code: 'G1B',
    paint: '#6aaee6',
    sheen: '#ff9a3c',
    metalness: 0.3,
    gradient: ['#8cc8ff', '#ff9a3c', '#c9e6ff', '#eaf5ff'],
    canvas: '#f1f7fd',
    ink: '#0b1b2c',
    accent: ['#2f86d6', '#ff8a2a'],
    dark: false,
  },
  {
    id: 'python',
    name: 'Python Green',
    code: 'P5G',
    paint: '#25c26e',
    sheen: '#d8ff6a',
    metalness: 0.35,
    gradient: ['#3ddc84', '#7ad7ff', '#d8ff8a', '#effbe9'],
    canvas: '#f2fbf2',
    ink: '#08190f',
    accent: ['#14a85a', '#1a9fd6'],
    dark: false,
  },
  {
    id: 'berry',
    name: 'Frozen Berry',
    code: 'F8R',
    paint: '#e2589e',
    sheen: '#9b8cff',
    metalness: 0.4,
    gradient: ['#ff7eb6', '#9b7bff', '#ffc2dc', '#fdeef6'],
    canvas: '#fdf2f8',
    ink: '#220a17',
    accent: ['#d23d8a', '#8a63ff'],
    dark: false,
  },
  {
    id: 'signal',
    name: 'Signal Yellow',
    code: 'S1Y',
    paint: '#ffcc00',
    sheen: '#ff6a3d',
    metalness: 0.3,
    gradient: ['#ffd84a', '#ff8a5c', '#fff09a', '#fffae0'],
    canvas: '#fffbea',
    ink: '#1d1503',
    accent: ['#f0a400', '#ff6a3d'],
    dark: false,
  },
  {
    id: 'night',
    name: 'Night Shift',
    code: 'N0X',
    paint: '#1b1d26',
    sheen: '#7a6cff',
    metalness: 0.6,
    gradient: ['#3b2a8f', '#0f6b8a', '#6a2a6b', '#0c0e15'],
    canvas: '#0b0c12',
    ink: '#f4f1ea',
    accent: ['#a395ff', '#5fd4ff'],
    dark: true,
  },
]

export const DEFAULT_LIVERY = LIVERIES[0]
