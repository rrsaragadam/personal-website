'use client'

import { Github, Linkedin, Mail, ArrowUpRight } from 'lucide-react'

export function AboutPanel() {
  return (
    <div className="space-y-7 text-white">
      {/* Name + role */}
      <div>
        <p className="mb-2 font-sans text-[11px] tracking-[0.2em] text-white/40 uppercase">
          About
        </p>
        <h2 className="font-display text-[38px] leading-[1.1] text-white">Rishi Saragadam</h2>
        <p className="mt-2 font-sans text-sm font-medium tracking-wide text-white/50">
          Product Designer
        </p>
      </div>

      <div className="h-px bg-white/10" />

      {/* Bio */}
      <div className="space-y-3">
        <p className="font-sans text-sm leading-relaxed text-white/70">
          I design digital products that feel inevitable — where every detail has been considered and
          everything unnecessary has been removed. Obsessed with the space between function and
          beauty.
        </p>
        <p className="font-sans text-sm leading-relaxed text-white/70">
          Currently exploring the intersection of 3D interfaces, motion design, and human-computer
          interaction. Based wherever my laptop is.
        </p>
      </div>

      <div className="h-px bg-white/10" />

      {/* Links */}
      <div>
        <p className="mb-4 font-sans text-[11px] tracking-[0.2em] text-white/40 uppercase">
          Connect
        </p>
        <div className="space-y-2">
          {[
            { icon: Github, label: 'GitHub', href: 'https://github.com' },
            { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
            { icon: Mail, label: 'Email', href: 'mailto:rishi@example.com' },
          ].map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 transition-colors hover:border-white/20 hover:bg-white/10"
            >
              <div className="flex items-center gap-3">
                <Icon size={15} strokeWidth={1.5} className="text-white/50" />
                <span className="font-sans text-sm text-white/80">{label}</span>
              </div>
              <ArrowUpRight size={13} strokeWidth={1.5} className="text-white/30" />
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
