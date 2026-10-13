import { WORK } from '@/content/work'
import { SectionHeading } from '@/features/ui/SectionHeading'
import { Reveal } from '@/features/ui/Reveal'

export function WorkSection() {
  return (
    <section
      id="work"
      className="relative px-6 py-24 sm:px-10 sm:py-28 lg:px-16"
    >
      <Reveal>
        <div data-reveal>
          <SectionHeading index="02" eyebrow="Experience">
            Where I’ve{' '}
            <span className="font-display font-normal italic">worked</span>
          </SectionHeading>
        </div>
        <ol className="border-ink/12 border-t">
          {WORK.map((job) => (
            <li
              key={job.company}
              data-reveal
              className="group border-ink/12 relative grid gap-3 border-b py-8 sm:grid-cols-[180px_1fr_1.2fr] sm:gap-10 sm:py-10"
            >
              {/* Paint stripe that sweeps in on hover */}
              <span
                aria-hidden
                className="from-accent absolute top-[-1px] left-0 h-[2px] w-full origin-left scale-x-0 bg-gradient-to-r to-[var(--accent-2)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
              />
              <span className="text-ink/45 pt-2 font-mono text-xs">
                {job.period}
              </span>
              <div>
                <h3 className="text-ink text-[clamp(1.75rem,3vw,2.5rem)] leading-none font-semibold tracking-[-0.03em] transition-transform duration-500 group-hover:translate-x-1">
                  {job.company}
                </h3>
                <p className="text-ink/55 font-display mt-2 text-xl italic">
                  {job.role}
                </p>
              </div>
              <p className="text-ink/65 pt-1 text-[15px] leading-relaxed">
                {job.description}
              </p>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  )
}
