'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowUpRight } from 'lucide-react'
import { PROJECTS } from '@/content/projects'
import { Act } from './Act'

gsap.registerPlugin(ScrollTrigger)

// Act two: the sample fan turns through your projects; the one in focus is
// written out beside it, in its own colour.
export function Projects() {
  const [index, setIndex] = useState(0)
  const card = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const st = ScrollTrigger.create({
      trigger: '#projects',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: ({ progress }) => {
        const n = PROJECTS.length
        const x = Math.min(n - 1, Math.max(0, progress * n - 0.5))
        setIndex(Math.min(n - 1, Math.round(x)))
      },
    })
    return () => st.kill()
  }, [])

  useEffect(() => {
    const el = card.current
    if (!el) return
    const ctx = gsap.context(() => {
      gsap.from('[data-stagger]', {
        y: 28,
        opacity: 0,
        filter: 'blur(6px)',
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.05,
      })
    }, el)
    return () => ctx.revert()
  }, [index])

  const p = PROJECTS[index]

  return (
    <Act id="projects" length="h-[420svh]" label="Selected work">
      <p className="absolute top-[17svh] left-6 font-mono text-[11px] tracking-[0.3em] uppercase opacity-60 md:left-[6vw]">
        (02) — Selected work
      </p>

      <div className="absolute inset-x-6 bottom-[8svh] md:top-[24svh] md:right-[6vw] md:bottom-auto md:left-[54vw]">
        <div ref={card} key={p.title}>
          <div data-stagger className="flex items-end gap-4">
            <span className="text-outline font-sans text-[22vw] leading-[0.8] font-extralight tracking-[-0.06em] md:text-[11vw]">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="mb-2 font-mono text-[11px] tracking-[0.3em] opacity-50">
              / {String(PROJECTS.length).padStart(2, '0')}
            </span>
          </div>
          <h2
            data-stagger
            className="mt-6 font-sans text-[9vw] leading-[0.95] font-extrabold tracking-[-0.035em] md:text-[4.2vw]"
          >
            {p.title}
          </h2>
          <p
            data-stagger
            className="text-accent mt-5 font-mono text-[11px] tracking-[0.3em] uppercase"
          >
            {p.code} · Anodised · {p.year}
          </p>
          <p
            data-stagger
            className="mt-6 max-w-md text-base leading-relaxed text-pretty opacity-70 md:text-lg"
          >
            {p.description}
          </p>
          <div data-stagger className="mt-8 flex items-center gap-8">
            <ul className="flex gap-4 font-mono text-[11px] tracking-[0.2em] uppercase opacity-50">
              {p.tags.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
            <a
              href={p.href}
              className="group text-accent ml-auto inline-flex items-center gap-1.5 font-mono text-[11px] tracking-[0.3em] uppercase md:ml-0"
            >
              Open
              <ArrowUpRight
                strokeWidth={1.5}
                className="size-3.5 transition-transform duration-300 ease-(--ease-out-soft) group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </div>

      <p className="absolute bottom-8 left-6 hidden font-mono text-[10px] tracking-[0.4em] uppercase opacity-40 md:left-[6vw] md:block">
        Keep scrolling to turn the deck
      </p>
    </Act>
  )
}
