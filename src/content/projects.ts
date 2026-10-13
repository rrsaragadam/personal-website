export interface Project {
  title: string
  description: string
  tags: string[]
  href: string
  year: string
  // The project's anodised finish: its chip in the sample fan, and the
  // colour the studio light and type take on while it's in focus.
  finish: string
  code: string
}

export const PROJECTS: Project[] = [
  {
    title: 'Paint to Sample',
    description:
      'This website. A scroll-driven film of machined objects in a studio, built with Three.js, React Three Fiber and GSAP.',
    tags: ['Three.js', 'Next.js', 'GSAP'],
    href: '#',
    year: '2026',
    finish: '#ff5b1f',
    code: 'L2B',
  },
  {
    title: 'Clarity Design System',
    description:
      'A modular component library with a focus on accessibility, consistency, and developer experience.',
    tags: ['Figma', 'React', 'Storybook'],
    href: '#',
    year: '2025',
    finish: '#3f8fe0',
    code: 'G1B',
  },
  {
    title: 'Finance Dashboard',
    description:
      'Real-time personal finance tracking with beautiful data visualizations and habit insights.',
    tags: ['TypeScript', 'D3.js', 'Tailwind'],
    href: '#',
    year: '2024',
    finish: '#1fb866',
    code: 'P5G',
  },
]
