'use client'

import { useState } from 'react'
import { BOOKS } from '@/content/books'
import { SectionHeading } from '@/features/ui/SectionHeading'
import { Reveal } from '@/features/ui/Reveal'
import { cn } from '@/lib/utils'

// A shelf of lacquered spines. Hover or tap one and it slides up off the
// shelf while its note appears beside it.
export function ReadingSection() {
  const [selected, setSelected] = useState(0)
  const book = BOOKS[selected]

  return (
    <section
      id="reading"
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
    >
      <Reveal>
        <div data-reveal>
          <SectionHeading index="03" eyebrow="Reading">
            On the{' '}
            <span className="font-display font-normal italic">shelf</span>
          </SectionHeading>
        </div>
        <div
          data-reveal
          className="grid items-end gap-12 lg:grid-cols-[auto_1fr] lg:gap-20"
        >
          <div className="border-ink/20 flex h-[340px] items-end gap-2.5 border-b-2 pb-0">
            {BOOKS.map((b, i) => {
              const active = i === selected
              return (
                <button
                  key={b.title}
                  onMouseEnter={() => setSelected(i)}
                  onFocus={() => setSelected(i)}
                  onClick={() => setSelected(i)}
                  aria-pressed={active}
                  aria-label={`${b.title} by ${b.author}`}
                  className={cn(
                    'relative flex w-[58px] items-center justify-center overflow-hidden rounded-t-md rounded-b-sm sm:w-[68px]',
                    'shadow-[inset_-6px_0_12px_rgb(0_0_0/0.18),inset_4px_0_8px_rgb(255_255_255/0.35)]',
                    'transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
                    active ? '-translate-y-6' : 'hover:-translate-y-2'
                  )}
                  style={{ background: b.color, height: `${b.height}%` }}
                >
                  <span className="grain absolute inset-0" />
                  <span className="relative line-clamp-1 max-h-[90%] rotate-180 text-[12px] font-semibold tracking-tight text-black/75 [writing-mode:vertical-rl]">
                    {b.title}
                  </span>
                </button>
              )
            })}
          </div>
          <div
            key={book.title}
            className="max-w-2xl animate-[fadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)] pb-2"
          >
            <p className="text-ink/45 mb-4 text-[11px] tracking-[0.28em] uppercase">
              {book.author}
            </p>
            <h3 className="text-ink font-display text-[clamp(2.25rem,4.5vw,4rem)] leading-[1]">
              {book.title}
            </h3>
            <p className="text-ink/70 mt-6 text-lg leading-relaxed">
              “{book.thought}”
            </p>
          </div>
        </div>
      </Reveal>
    </section>
  )
}
