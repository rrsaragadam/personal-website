import { PROFILE } from '@/content/profile'
import { PaintChips } from '@/features/livery/PaintChips'

// The sheet ends here and the object comes back into view, so the page closes
// the way it opened.
export function Footer() {
  const email = PROFILE.links.find((l) => l.label === 'Email')?.href ?? '#'
  return (
    <footer
      id="contact"
      className="relative z-10 flex min-h-svh flex-col justify-between px-6 pt-32 pb-10 sm:px-10 lg:px-16"
    >
      <div className="max-w-4xl">
        <p className="text-ink/55 mb-6 text-[11px] tracking-[0.28em] uppercase">
          Say hello
        </p>
        <h2 className="text-ink text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-semibold tracking-[-0.05em]">
          Let’s make
          <br />
          something{' '}
          <span className="font-display font-normal italic">good</span>
          <span className="text-accent">.</span>
        </h2>
        <a
          href={email}
          className="bg-ink text-canvas mt-10 inline-flex h-14 items-center rounded-full px-8 text-[15px] font-medium transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
        >
          Get in touch
        </a>
      </div>
      <div className="flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between">
        <PaintChips />
        <p className="text-ink/45 text-xs">
          © {new Date().getFullYear()} {PROFILE.name}. Built with Three.js,
          React Three Fiber and GSAP.
        </p>
      </div>
    </footer>
  )
}
