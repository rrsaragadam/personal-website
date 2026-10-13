export interface Project {
  title: string
  description: string
  tags: string[]
  href: string
  year: string
  // Cover gradient; deliberately independent of the livery so each project
  // keeps its own identity whatever finish the page is in.
  cover: [string, string, string]
}

export const PROJECTS: Project[] = [
  {
    title: 'Paint to Sample',
    description:
      'This website. A configurable 3D object and a page that repaints itself, built with Three.js, React Three Fiber, and GSAP.',
    tags: ['Three.js', 'Next.js', 'GSAP'],
    href: '#',
    year: '2026',
    cover: ['#ff5b1f', '#ff4d6d', '#ffc46b'],
  },
  {
    title: 'Clarity Design System',
    description:
      'A modular component library with a focus on accessibility, consistency, and developer experience.',
    tags: ['Figma', 'React', 'Storybook'],
    href: '#',
    year: '2025',
    cover: ['#6aaee6', '#9b7bff', '#c9e6ff'],
  },
  {
    title: 'Finance Dashboard',
    description:
      'Real-time personal finance tracking with beautiful data visualizations and habit insights.',
    tags: ['TypeScript', 'D3.js', 'Tailwind'],
    href: '#',
    year: '2024',
    cover: ['#25c26e', '#7ad7ff', '#d8ff8a'],
  },
]
