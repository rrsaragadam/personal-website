'use client'

import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { useLivery } from '@/features/livery/useLivery'

const LINKS = [
  { id: 'projects', label: 'Projects' },
  { id: 'work', label: 'Work' },
  { id: 'reading', label: 'Reading' },
  { id: 'about', label: 'About' },
]

// Floating glass pill. A lacquered indicator slides under the section you're
// reading, and the dot on the right cycles through finishes from anywhere.
export function Nav() {
  const [active, setActive] = useState<string | null>(null)
  const [indicator, setIndicator] = useState({ left: 0, width: 0 })
  const linkRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const livery = useLivery((s) => s.livery)
  const next = useLivery((s) => s.next)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' }
    )
    for (const { id } of [...LINKS, { id: 'top' }, { id: 'contact' }]) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    const el = active ? linkRefs.current[active] : null
    if (el) setIndicator({ left: el.offsetLeft, width: el.offsetWidth })
  }, [active])

  const showIndicator = LINKS.some((l) => l.id === active)

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex justify-center px-4">
      <nav className="glass flex items-center gap-1 rounded-full p-1.5 shadow-[0_10px_40px_-12px_rgb(0_0_0/0.25)]">
        <a
          href="#top"
          className="text-ink flex h-9 items-center rounded-full px-3.5 text-sm font-semibold tracking-tight"
          aria-label="Back to top"
        >
          RS
        </a>
        <div className="relative flex items-center">
          <span
            aria-hidden
            className={cn(
              'bg-ink absolute top-0 h-9 rounded-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]',
              showIndicator ? 'opacity-100' : 'opacity-0'
            )}
            style={{ left: indicator.left, width: indicator.width }}
          />
          {LINKS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              ref={(el) => {
                linkRefs.current[id] = el
              }}
              className={cn(
                'relative h-9 rounded-full px-3.5 text-[13px] leading-9 transition-colors duration-300 max-sm:px-2.5 max-sm:text-xs',
                active === id ? 'text-canvas' : 'text-ink/65 hover:text-ink'
              )}
            >
              {label}
            </a>
          ))}
        </div>
        <button
          onClick={next}
          aria-label={`Change finish (now ${livery.name})`}
          title={`${livery.name} — tap to repaint`}
          className="chip ml-1 size-9 rounded-full transition-transform duration-300 hover:scale-105 active:scale-95"
          style={{
            ['--chip' as string]: livery.paint,
            ['--chip-sheen' as string]: livery.sheen,
          }}
        />
      </nav>
    </header>
  )
}
