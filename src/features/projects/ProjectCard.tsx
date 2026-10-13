'use client'

import { useRef, type PointerEvent } from 'react'
import { ArrowUpRight } from 'lucide-react'
import type { Project } from '@/content/projects'
import { cn } from '@/lib/utils'

// A lacquered cover that tilts toward the cursor with a moving glint, the way
// a painted panel catches studio light as you walk around it.
export function ProjectCard({
  project,
  featured,
}: {
  project: Project
  featured?: boolean
}) {
  const card = useRef<HTMLAnchorElement>(null)

  const onMove = (e: PointerEvent<HTMLAnchorElement>) => {
    const el = card.current
    if (!el || e.pointerType !== 'mouse') return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width
    const y = (e.clientY - r.top) / r.height
    el.style.setProperty('--rx', `${(0.5 - y) * 7}deg`)
    el.style.setProperty('--ry', `${(x - 0.5) * 9}deg`)
    el.style.setProperty('--gx', `${x * 100}%`)
    el.style.setProperty('--gy', `${y * 100}%`)
  }

  const onLeave = () => {
    const el = card.current
    if (!el) return
    el.style.setProperty('--rx', '0deg')
    el.style.setProperty('--ry', '0deg')
  }

  const [a, b, c] = project.cover

  return (
    <a
      ref={card}
      href={project.href}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      data-reveal
      className="group block [perspective:1200px]"
    >
      <div
        className={cn(
          'relative overflow-hidden rounded-[28px] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
          '[transform:rotateX(var(--rx,0deg))_rotateY(var(--ry,0deg))] [transform-style:preserve-3d]',
          'shadow-[0_30px_60px_-30px_rgb(0_0_0/0.35)]',
          featured ? 'aspect-[16/9] sm:aspect-[21/9]' : 'aspect-[4/3]'
        )}
        style={{
          ['--a' as string]: a,
          ['--b' as string]: b,
          ['--c' as string]: c,
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_10%_10%,var(--c)_0%,transparent_55%),radial-gradient(90%_90%_at_90%_80%,var(--b)_0%,transparent_60%),linear-gradient(135deg,var(--a),var(--b))]" />
        <div className="grain absolute inset-0" />
        {/* Moving glint */}
        <div className="absolute inset-0 bg-[radial-gradient(40%_50%_at_var(--gx,50%)_var(--gy,50%),rgb(255_255_255/0.45),transparent_70%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 flex flex-col justify-between p-6 text-white sm:p-8">
          <div className="flex items-start justify-between">
            <span className="font-mono text-xs opacity-80">{project.year}</span>
            <span className="flex size-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-md transition-all duration-300 group-hover:scale-110 group-hover:bg-white group-hover:text-black">
              <ArrowUpRight size={16} strokeWidth={1.75} />
            </span>
          </div>
          <h3
            className={cn(
              'font-display leading-[0.9] tracking-[-0.02em] drop-shadow-[0_2px_20px_rgb(0_0_0/0.15)]',
              featured
                ? 'text-[clamp(3rem,8vw,7.5rem)]'
                : 'text-[clamp(2.25rem,4vw,3.5rem)]'
            )}
          >
            {project.title}
          </h3>
        </div>
      </div>
      <div className="mt-5 flex flex-col gap-3 px-1 sm:flex-row sm:items-start sm:justify-between sm:gap-8">
        <p className="text-ink/65 max-w-xl text-[15px] leading-relaxed">
          {project.description}
        </p>
        <div className="flex shrink-0 flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="border-ink/12 text-ink/60 rounded-full border px-3 py-1 text-[11px]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </a>
  )
}
