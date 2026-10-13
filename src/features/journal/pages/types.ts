// A clickable region on a page, in page-canvas pixels.
export type Action =
  | { type: 'spread'; to: number }
  | { type: 'link'; href: string }

export interface Spot {
  x: number
  y: number
  w: number
  h: number
  action: Action
}

export interface Page {
  paint: (
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    spots: Spot[]
  ) => void
  // Photos the page prints, so it can repaint once they've loaded.
  images?: string[]
  // Plain text for screen readers and search.
  text: string
}
