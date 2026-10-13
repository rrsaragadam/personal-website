'use client'

import { ArrowLeft, ArrowRight, X } from 'lucide-react'
import { PROFILE } from '@/content/profile'
import { SPREADS } from './spreads'
import { SECTIONS } from './sections'
import { useJournal } from './useJournal'

// The only interface outside the journal: a name, a whisper of a hint and
// three quiet buttons. Screen readers get every page as text.
export function Hud() {
  const spread = useJournal((s) => s.spread)
  const { next, prev, close, open, go } = useJournal()
  const section = [...SECTIONS].reverse().find((s) => spread >= s.spread)

  const btn =
    'grid size-11 place-items-center rounded-full bg-black/25 text-white/90 backdrop-blur-md transition duration-300 ease-(--ease-out-soft) hover:scale-[1.04] hover:bg-black/40 disabled:opacity-30'

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-10 flex items-baseline justify-between px-6 pt-6 text-white md:px-10 md:pt-8">
        <h1 className="font-hand text-3xl leading-none whitespace-nowrap drop-shadow-[0_1px_8px_rgb(0_0_0/0.45)] md:text-4xl">
          {PROFILE.name}
        </h1>
        <p className="text-right font-mono text-[11px] tracking-[0.2em] uppercase opacity-80 drop-shadow-[0_1px_6px_rgb(0_0_0/0.5)] md:tracking-[0.3em]">
          {spread === 0 ? 'Field log · vol. 07' : (section?.title ?? 'Index')}
        </p>
      </header>

      <footer className="fixed inset-x-0 bottom-0 z-10 flex items-center justify-center gap-3 pb-6 md:pb-8">
        {spread === 0 ? (
          <button
            onClick={open}
            className="font-hand rounded-full bg-black/25 px-6 py-2.5 text-2xl text-white backdrop-blur-md transition duration-300 ease-(--ease-out-soft) hover:scale-[1.03] hover:bg-black/40"
          >
            Open the journal
          </button>
        ) : (
          <>
            <button aria-label="Previous page" onClick={prev} className={btn}>
              <ArrowLeft strokeWidth={1.5} className="size-5" />
            </button>
            <button
              aria-label="Close the journal"
              onClick={close}
              className={btn}
            >
              <X strokeWidth={1.5} className="size-5" />
            </button>
            <button
              aria-label="Next page"
              onClick={next}
              disabled={spread === SPREADS.length}
              className={btn}
            >
              <ArrowRight strokeWidth={1.5} className="size-5" />
            </button>
          </>
        )}
      </footer>

      {/* The journal as text, for screen readers and search engines */}
      <nav className="sr-only" aria-label="Journal sections">
        <ul>
          {SECTIONS.map((s) => (
            <li key={s.id}>
              <button onClick={() => go(s.spread)}>{s.title}</button>
            </li>
          ))}
        </ul>
      </nav>
      <article className="sr-only">
        {SPREADS.map((s, i) => (
          <section key={i}>
            <p>{s.left.text}</p>
            <p>{s.right.text}</p>
          </section>
        ))}
        <ul>
          {PROFILE.links.map((l) => (
            <li key={l.label}>
              <a href={l.href}>{l.label}</a>
            </li>
          ))}
        </ul>
      </article>
    </>
  )
}
