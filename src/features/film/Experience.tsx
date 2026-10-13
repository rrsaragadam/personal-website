'use client'

import { useRef } from 'react'
import { WORK } from '@/content/work'
import { useReveal } from './useReveal'

// Act three is pure type: each role a single line, set large, read like the
// credits of a film.
export function Experience() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section
      ref={ref}
      id="experience"
      aria-label="Experience"
      className="px-6 pt-[22svh] pb-[18svh] md:px-[6vw]"
    >
      <p className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-60">
        <span data-reveal>(03) — Experience</span>
      </p>
      <ol className="mt-16">
        {WORK.map((w) => (
          <li
            key={w.company}
            className="group grid gap-4 border-t border-white/10 py-10 md:grid-cols-12 md:items-baseline md:gap-8"
          >
            <span className="font-mono text-[11px] tracking-[0.25em] uppercase opacity-50 md:col-span-2">
              <span data-reveal>{w.period}</span>
            </span>
            <h3 className="font-display group-hover:text-accent text-[13vw] leading-[0.9] italic transition-colors duration-500 md:col-span-6 md:text-[6.4vw]">
              <span data-reveal>{w.company}</span>
            </h3>
            <div className="md:col-span-4">
              <p className="font-sans text-sm font-semibold tracking-tight">
                <span data-reveal>{w.role}</span>
              </p>
              <p className="mt-2 max-w-sm text-sm leading-relaxed opacity-60">
                {w.description}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  )
}
