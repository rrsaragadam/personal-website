'use client'

const WORK_HISTORY = [
  {
    company: 'Wealthsimple',
    role: 'Senior Product Designer',
    period: '2023 — Present',
    description:
      'Leading design for the investing experience. Shipping features used by millions of Canadians managing their financial futures.',
  },
  {
    company: 'Shopify',
    role: 'Product Designer',
    period: '2021 — 2023',
    description:
      'Designed checkout and payments flows. Reduced friction in the purchase journey across 2M+ merchants.',
  },
  {
    company: 'Freelance',
    role: 'Product Designer',
    period: '2019 — 2021',
    description:
      'Worked with early-stage startups across fintech, health, and productivity. End-to-end from research to high-fidelity.',
  },
]

export function WorkPanel() {
  return (
    <div className="space-y-7 text-white">
      <div>
        <p className="mb-2 font-sans text-[11px] tracking-[0.2em] text-white/40 uppercase">
          Experience
        </p>
        <h2 className="font-display text-[38px] leading-[1.1]">Work History</h2>
      </div>

      <div className="h-px bg-white/10" />

      <div className="space-y-6">
        {WORK_HISTORY.map((job, i) => (
          <div key={i} className="relative pl-4">
            {/* Timeline dot */}
            <div className="absolute top-[7px] left-0 h-1.5 w-1.5 rounded-full bg-white/40" />
            {/* Vertical line (except last) */}
            {i < WORK_HISTORY.length - 1 && (
              <div className="absolute top-4 left-[2.5px] bottom-[-24px] w-px bg-white/10" />
            )}

            <div className="space-y-1">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="font-sans text-sm font-semibold text-white/90">{job.company}</p>
                  <p className="font-sans text-sm text-white/55">{job.role}</p>
                </div>
                <span className="shrink-0 font-sans text-[11px] text-white/35">{job.period}</span>
              </div>
              <p className="pt-1 font-sans text-sm leading-relaxed text-white/55">
                {job.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
