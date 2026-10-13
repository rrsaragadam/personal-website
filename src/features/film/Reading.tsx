'use client'

import { useRef } from 'react'
import { BOOKS } from '@/content/books'
import { cn } from '@/lib/utils'
import { useReveal } from './useReveal'

// Act four: the shelf. Titles are set as a tight wall of type; hovering one
// lights it in its own cover colour and shows what it taught you.
export function Reading() {
  const ref = useRef<HTMLElement>(null)
  useReveal(ref)

  return (
    <section
      ref={ref}
      id="reading"
      aria-label="Reading"
      className="px-6 pt-[10svh] pb-[24svh] md:px-[6vw]"
    >
      <p className="font-mono text-[11px] tracking-[0.3em] uppercase opacity-60">
        <span data-reveal>(04) — On the shelf</span>
      </p>
      <ul className="mt-14">
        {BOOKS.map((b, i) => (
          <li
            key={b.title}
            // The one dynamic value: each book's cover colour, for hover.
            style={{ '--book': b.color } as React.CSSProperties}
            className={cn(
              'group grid gap-3 py-5 md:grid-cols-12 md:items-baseline md:gap-8',
              i > 0 && 'border-t border-white/10'
            )}
          >
            <span className="font-mono text-[11px] tracking-[0.25em] opacity-40 md:col-span-1">
              {String(i + 1).padStart(2, '0')}
            </span>
            <h3 className="text-ink/90 font-sans text-[8vw] leading-[0.95] font-extrabold tracking-[-0.035em] transition-colors duration-500 group-hover:text-(--book) md:col-span-7 md:text-[3.6vw]">
              <span data-reveal>{b.title}</span>
            </h3>
            <div className="md:col-span-4">
              <p className="font-mono text-[11px] tracking-[0.25em] uppercase opacity-50">
                {b.author}
              </p>
              <p className="font-display mt-2 max-w-sm text-xl leading-snug italic opacity-0 transition-all duration-500 ease-(--ease-out-soft) group-hover:opacity-80 max-md:opacity-70">
                “{b.thought}”
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
