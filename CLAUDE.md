# Personal Projects

## Design DNA
- Channel Apple, Wealthsimple, and Jony Ive: restrained, confident, obsessively refined.
- Every pixel matters. Alignment, spacing, and proportion should feel mathematically intentional.
- Generous whitespace. Let content breathe. Density is not a virtue.
- Muted, neutral palettes with one or two precise accent colors. No gradients unless they're subtle and purposeful.
- Rounded corners (10–16px), soft shadows, and glass/blur effects used sparingly.
- Interfaces should feel calm and inevitable — like there was no other way to design them.

## Typography
- Typography is a design decision, not a default. Choose typefaces that match the personality of the app.
- Make bold choices: serif for editorial warmth, geometric sans for tech precision, monospace for developer tools, display faces for landing pages. Mix weights and sizes with intention.
- Pair fonts deliberately — one for headings, one for body. Contrast in style, harmony in tone.
- Size headings confidently. Go large when the content earns it.
- Source from Google Fonts or `next/font`. Never fall back to unstyled system fonts.

## Frontend Stack
- Use component libraries: shadcn/ui, Radix UI, or Headless UI for React projects.
- Tailwind CSS for styling. No inline styles.
- Icons: Lucide React or Phosphor Icons. Consistent stroke weight throughout.

## Animation & Motion
- Use GSAP for scroll-triggered animations, page transitions, and orchestrated sequences.
- Use Framer Motion for component enter/exit, layout shifts, and micro-interactions.
- Transitions should feel physical — gentle easing, no linear moves, no hard cuts.
- Timing: 200–400ms for micro-interactions, 500–800ms for reveals and page transitions.
- Hover states: subtle scale (1.02–1.04), opacity shifts, or soft color transitions.
- Motion guides the eye and confirms actions. Never decorative for its own sake.

## Code Standards
- Use the right language for the job — TypeScript, Python, Swift, Rust, Go, or whatever fits.
- Clean, readable code over clever code. Favor clarity and simplicity.
- Group files by feature, not by type.
- One component per file in frontend projects. Co-locate related styles, types, and tests.
- Prefer functional patterns and composition over inheritance.

## Frontend Defaults (when building web UIs)
- Framework: Next.js (App Router) unless otherwise specified.
- Package manager: pnpm.
- Linting: ESLint + Prettier, 2-space indentation, single quotes, no semicolons.
- Desktop-first layouts. Responsive down to tablet where it makes sense, but optimize for large screens.
- Run `pnpm lint` before committing.