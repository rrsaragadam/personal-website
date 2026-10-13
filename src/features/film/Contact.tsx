'use client'

import { useRef } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { PROFILE } from '@/content/profile'
import { Act } from './Act'
import { useReveal } from './useReveal'

// The last act: the aluminium card rises into the light while the type
// makes the ask.
export function Contact() {
  const ref = useRef<HTMLDivElement>(null)
  useReveal(ref)

  return (
    <Act id="contact" length="h-[180svh]" label="Contact">
      <div ref={ref} className="relative h-full px-6 md:px-[6vw]">
        <p className="absolute top-[17svh] font-mono text-[11px] tracking-[0.3em] uppercase opacity-60">
          <span data-reveal>(05) — Contact</span>
        </p>

        <h2 className="absolute top-[24svh] left-6 md:left-[6vw]">
          <span
            data-reveal
            className="block font-sans text-[11vw] leading-[0.9] font-black tracking-[-0.045em] uppercase md:text-[6.4vw]"
          >
            Let’s make
          </span>
          <span
            data-reveal
            className="font-display text-accent block text-[16vw] leading-[0.85] italic md:text-[9vw]"
          >
            something
          </span>
          <span
            data-reveal
            className="block pt-3 text-[6vw] font-extralight tracking-[0.32em] md:text-[2.4vw]"
          >
            inevitable.
          </span>
        </h2>

        <ul className="absolute bottom-[16svh] left-6 flex flex-col gap-3 md:left-[6vw]">
          {PROFILE.links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className="group inline-flex items-center gap-2 font-mono text-xs tracking-[0.3em] uppercase opacity-70 transition-opacity duration-300 hover:opacity-100"
              >
                <span className="bg-accent h-px w-6 transition-all duration-300 ease-(--ease-out-soft) group-hover:w-10" />
                {l.label}
                <ArrowUpRight strokeWidth={1.5} className="size-3.5" />
              </a>
            </li>
          ))}
        </ul>

        <footer className="absolute inset-x-6 bottom-8 flex justify-between font-mono text-[10px] tracking-[0.3em] uppercase opacity-40 md:inset-x-[6vw]">
          <span>© 2026 {PROFILE.name}</span>
          <span className="hidden md:inline">
            Lit in a studio that doesn’t exist
          </span>
        </footer>
      </div>
    </Act>
  )
}
