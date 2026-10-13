// The cabin is modelled in metres, from the driver's seat: x to the right,
// y up, and the nose of the car toward -z.
type V3 = [number, number, number]

export interface Pose {
  eye: V3
  target: V3
  fov: number
}

export interface CabinLayout {
  // Where the camera sits before the key is docked, and once it is.
  arrival: Pose
  home: Pose
  display: {
    position: V3
    // Yaw toward the driver, then a slight tilt back.
    yaw: number
    pitch: number
    size: [number, number]
    // CSS pixel width the screen content is laid out at.
    px: number
    toggles: number[]
    knob: number
    multigraph: [number, number]
    // The box the camera frames when it leans in: centre and size.
    focus: { x: number; y: number; width: number; height: number }
  }
}

export const LANDSCAPE: CabinLayout = {
  arrival: { eye: [0.14, 1.34, 1.6], target: [0.22, 0.9, -0.05], fov: 40 },
  home: { eye: [0.12, 1.26, 1.18], target: [0.22, 0.92, -0.05], fov: 42 },
  display: {
    position: [0.5, 1.08, -0.02],
    yaw: -0.5,
    pitch: -0.12,
    size: [0.38, 0.24],
    px: 920,
    toggles: [-0.15, -0.1, -0.05, 0],
    knob: 0.14,
    multigraph: [0.226, 0.092],
    focus: { x: 0.025, y: -0.047, width: 0.56, height: 0.39 },
  },
}

// On a phone the display swings upright, the way the Luce screen pivots on
// its ball joint, and the camera sits back between the seats.
export const PORTRAIT: CabinLayout = {
  arrival: { eye: [0.24, 1.6, 2.1], target: [0.24, 0.9, -0.05], fov: 60 },
  home: { eye: [0.22, 1.5, 1.72], target: [0.24, 0.92, -0.05], fov: 56 },
  display: {
    position: [0.46, 1.12, -0.02],
    yaw: -0.38,
    pitch: -0.1,
    size: [0.24, 0.34],
    px: 420,
    toggles: [-0.095, -0.053, -0.011, 0.031],
    knob: 0.083,
    multigraph: [0.085, 0.208],
    focus: { x: 0, y: -0.01, width: 0.27, height: 0.5 },
  },
}
