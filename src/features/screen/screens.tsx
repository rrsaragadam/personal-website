import { ArrowUpRight } from 'lucide-react'
import { PROFILE } from '@/content/profile'
import { PROJECTS } from '@/content/projects'
import { WORK } from '@/content/work'
import { BOOKS } from '@/content/books'

// What the console's screen shows in each mode. Each screen gets the dial's
// current index and fills a fixed 1024 × 640 canvas (or 640 × 560 on phones).

const eyebrow =
  'font-mono text-[13px] tracking-[0.22em] text-white/45 uppercase'

export function HomeScreen() {
  return (
    <div className="flex h-full flex-col justify-center">
      <p className={eyebrow}>{PROFILE.role}</p>
      <h1 className="mt-4 text-[clamp(56px,9vw,104px)] leading-[0.88] font-semibold tracking-[-0.05em] text-white">
        Rishi
        <br />
        Saragadam<span className="text-accent">.</span>
      </h1>
      <p className="font-display mt-6 text-[34px] leading-[1.1] text-white/80">
        I design digital products that feel{' '}
        <em className="text-gradient pr-1">inevitable</em>.
      </p>
      <p className="mt-8 font-mono text-[12px] tracking-[0.18em] text-white/40 uppercase">
        Flip a switch to begin · Turn the small knob to change the finish
      </p>
    </div>
  )
}

export function ProjectScreen({ index }: { index: number }) {
  const p = PROJECTS[index]
  const [a, b, c] = p.cover
  return (
    <div className="flex h-full items-center gap-10 max-sm:flex-col max-sm:items-start max-sm:justify-center max-sm:gap-4">
      <div
        className="relative aspect-square h-[78%] shrink-0 overflow-hidden rounded-[22px] max-sm:h-[30%]"
        style={{
          background: `radial-gradient(120% 90% at 15% 10%, ${c} 0%, transparent 55%), linear-gradient(135deg, ${a}, ${b})`,
        }}
      >
        <div className="grain absolute inset-0" />
        <span className="absolute top-4 left-5 font-mono text-[12px] text-white/80">
          {p.year}
        </span>
      </div>
      <div className="min-w-0">
        <h2 className="font-display text-[58px] leading-[0.95] text-white max-sm:text-[38px]">
          {p.title}
        </h2>
        <p className="mt-4 text-[19px] leading-relaxed text-white/65 max-sm:mt-2 max-sm:line-clamp-2 max-sm:text-[17px]">
          {p.description}
        </p>
        <div className="mt-5 flex flex-wrap gap-2 max-sm:hidden">
          {p.tags.map((t) => (
            <span
              key={t}
              className="rounded-full border border-white/15 px-3 py-1 text-[13px] text-white/60"
            >
              {t}
            </span>
          ))}
        </div>
        <a
          href={p.href}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-[15px] font-medium text-black transition-transform hover:scale-[1.03] max-sm:mt-3"
        >
          Open project <ArrowUpRight size={16} strokeWidth={1.75} />
        </a>
      </div>
    </div>
  )
}

export function WorkScreen({ index }: { index: number }) {
  const job = WORK[index]
  return (
    <div className="flex h-full flex-col justify-center">
      <p className={eyebrow}>{job.period}</p>
      <h2 className="mt-3 text-[84px] leading-[0.9] font-semibold tracking-[-0.045em] text-white max-sm:text-[60px]">
        {job.company}
      </h2>
      <p className="font-display mt-2 text-[32px] text-white/70 italic">
        {job.role}
      </p>
      <p className="mt-6 max-w-[42rem] text-[20px] leading-relaxed text-white/65">
        {job.description}
      </p>
    </div>
  )
}

export function ReadingScreen({ index }: { index: number }) {
  const book = BOOKS[index]
  return (
    <div className="flex h-full items-center gap-10 max-sm:gap-6">
      <div
        className="relative h-[80%] w-[84px] shrink-0 overflow-hidden rounded-t-md rounded-b-sm shadow-[inset_-8px_0_14px_rgb(0_0_0/0.25),inset_5px_0_10px_rgb(255_255_255/0.35)] max-sm:w-[60px]"
        style={{ background: book.color }}
      >
        <div className="grain absolute inset-0" />
        <span className="absolute inset-0 flex rotate-180 items-center justify-center text-[14px] font-semibold text-black/75 [writing-mode:vertical-rl]">
          {book.title}
        </span>
      </div>
      <div>
        <p className={eyebrow}>{book.author}</p>
        <h2 className="font-display mt-3 text-[56px] leading-[0.98] text-white max-sm:text-[42px]">
          {book.title}
        </h2>
        <p className="mt-6 text-[21px] leading-relaxed text-white/70">
          “{book.thought}”
        </p>
      </div>
    </div>
  )
}

export function AboutScreen({ index }: { index: number }) {
  const para = PROFILE.bio[index]
  if (para)
    return (
      <div className="flex h-full flex-col justify-center">
        <p className={eyebrow}>About</p>
        <p className="font-display mt-5 text-[40px] leading-[1.18] text-white max-sm:text-[32px]">
          {para}
        </p>
      </div>
    )
  return <ContactScreen />
}

export function ContactScreen() {
  const email = PROFILE.links.find((l) => l.label === 'Email')?.href ?? '#'
  return (
    <div className="flex h-full flex-col justify-center">
      <p className={eyebrow}>Say hello</p>
      <h2 className="mt-3 text-[80px] leading-[0.9] font-semibold tracking-[-0.045em] text-white max-sm:text-[56px]">
        Let’s make something{' '}
        <span className="font-display font-normal italic">good</span>
        <span className="text-accent">.</span>
      </h2>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href={email}
          className="rounded-full bg-white px-6 py-3 text-[16px] font-medium text-black transition-transform hover:scale-[1.03]"
        >
          Get in touch
        </a>
        {PROFILE.links
          .filter((l) => l.label !== 'Email')
          .map((l) => (
            <a
              key={l.label}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-white/20 px-5 py-3 text-[16px] text-white/80 transition-colors hover:border-white/50 hover:text-white"
            >
              {l.label} <ArrowUpRight size={15} strokeWidth={1.75} />
            </a>
          ))}
      </div>
    </div>
  )
}
