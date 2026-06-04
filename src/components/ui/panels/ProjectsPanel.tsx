'use client'

import { ArrowUpRight } from 'lucide-react'

const PROJECTS = [
  {
    title: '3D Portfolio',
    description:
      'This website. An interactive 3D desk scene built with Three.js, React Three Fiber, and GSAP.',
    tags: ['Three.js', 'Next.js', 'GSAP'],
    href: '#',
    accent: '#6ee7b7',
  },
  {
    title: 'Clarity Design System',
    description:
      'A modular component library with a focus on accessibility, consistency, and developer experience.',
    tags: ['Figma', 'React', 'Storybook'],
    href: '#',
    accent: '#93c5fd',
  },
  {
    title: 'Finance Dashboard',
    description:
      'Real-time personal finance tracking with beautiful data visualizations and habit insights.',
    tags: ['TypeScript', 'D3.js', 'Tailwind'],
    href: '#',
    accent: '#f9a8d4',
  },
]

export function ProjectsPanel() {
  return (
    <div className="space-y-7 text-white">
      <div>
        <p className="mb-2 font-sans text-[11px] tracking-[0.2em] text-white/40 uppercase">
          Work
        </p>
        <h2 className="font-display text-[38px] leading-[1.1]">Projects</h2>
      </div>

      <div className="h-px bg-white/10" />

      <div className="space-y-4">
        {PROJECTS.map((project) => (
          <a
            key={project.title}
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group block rounded-2xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-white/20 hover:bg-white/8"
          >
            <div className="mb-3 flex items-start justify-between gap-2">
              <h3 className="font-sans text-base font-semibold text-white/90">{project.title}</h3>
              <ArrowUpRight
                size={15}
                strokeWidth={1.5}
                className="shrink-0 text-white/30 transition-colors group-hover:text-white/60"
              />
            </div>
            <p className="mb-4 font-sans text-sm leading-relaxed text-white/55">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-white/15 bg-white/8 px-3 py-1 font-sans text-[11px] text-white/55"
                >
                  {tag}
                </span>
              ))}
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
