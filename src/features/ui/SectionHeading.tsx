import type { ReactNode } from 'react'

interface SectionHeadingProps {
  index: string
  eyebrow: string
  children: ReactNode
}

export function SectionHeading({
  index,
  eyebrow,
  children,
}: SectionHeadingProps) {
  return (
    <div className="mb-14 flex flex-col gap-5 sm:mb-20">
      <div className="text-ink/45 flex items-center gap-4 text-[11px] tracking-[0.28em] uppercase">
        <span className="text-accent font-mono tracking-normal">{index}</span>
        <span className="bg-ink/15 h-px w-10" />
        <span>{eyebrow}</span>
      </div>
      <h2 className="text-ink max-w-4xl text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.95] font-semibold tracking-[-0.045em]">
        {children}
      </h2>
    </div>
  )
}
