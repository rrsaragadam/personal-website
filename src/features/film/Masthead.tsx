import { PROFILE } from '@/content/profile'

const LINKS = [
  { href: '#projects', label: 'Work' },
  { href: '#experience', label: 'Experience' },
  { href: '#reading', label: 'Reading' },
  { href: '#contact', label: 'Contact' },
]

// The only chrome: a monogram, a signature and four quiet links.
export function Masthead() {
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-30 flex items-start justify-between px-6 pt-6 md:px-10 md:pt-8">
      <a
        href="#intro"
        className="pointer-events-auto font-sans text-lg leading-none font-black tracking-tight"
      >
        RS
      </a>
      <span className="font-display absolute left-1/2 -translate-x-1/2 text-xl leading-none italic opacity-80">
        {PROFILE.name}
      </span>
      <nav className="pointer-events-auto hidden gap-6 font-mono text-[11px] tracking-[0.18em] uppercase md:flex">
        {LINKS.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="opacity-55 transition-opacity duration-300 hover:opacity-100"
          >
            {l.label}
          </a>
        ))}
      </nav>
    </header>
  )
}
