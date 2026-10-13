import { ArrowUpRight } from 'lucide-react'
import { PROFILE } from '@/content/profile'
import { SectionHeading } from '@/features/ui/SectionHeading'
import { Reveal } from '@/features/ui/Reveal'

export function AboutSection() {
  return (
    <section
      id="about"
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
    >
      <Reveal>
        <div data-reveal>
          <SectionHeading index="04" eyebrow="About">
            The space between{' '}
            <span className="font-display font-normal italic">function</span>{' '}
            and{' '}
            <span className="font-display text-gradient pr-2 font-normal italic">
              beauty
            </span>
          </SectionHeading>
        </div>
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr] lg:gap-20">
          <div className="flex flex-col gap-6">
            {PROFILE.bio.map((p) => (
              <p
                key={p}
                data-reveal
                className="text-ink/75 text-[clamp(1.125rem,1.6vw,1.375rem)] leading-relaxed"
              >
                {p}
              </p>
            ))}
          </div>
          <ul data-reveal className="border-ink/12 self-start border-t">
            {PROFILE.links.map(({ label, href }) => (
              <li key={label} className="border-ink/12 border-b">
                <a
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group text-ink flex items-center justify-between py-5 text-lg"
                >
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    {label}
                  </span>
                  <span className="border-ink/15 group-hover:bg-ink group-hover:text-canvas flex size-9 items-center justify-center rounded-full border transition-all duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={15} strokeWidth={1.75} />
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>
    </section>
  )
}
