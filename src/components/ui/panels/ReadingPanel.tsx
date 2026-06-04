'use client'

const BOOKS = [
  {
    emoji: '📐',
    title: 'The Design of Everyday Things',
    author: 'Don Norman',
    thought: 'Changed how I see every door handle, every button. Required reading.',
  },
  {
    emoji: '🏔',
    title: 'Zen and the Art of Motorcycle Maintenance',
    author: 'Robert Pirsig',
    thought: 'A meditation on quality. Slow, demanding, essential.',
  },
  {
    emoji: '🔲',
    title: 'Grid Systems in Graphic Design',
    author: 'Josef Müller-Brockmann',
    thought: 'Mathematical beauty. The foundation of everything I do in Figma.',
  },
  {
    emoji: '🧠',
    title: 'Thinking, Fast and Slow',
    author: 'Daniel Kahneman',
    thought: 'The science behind every UX decision. Humbling and practical.',
  },
]

export function ReadingPanel() {
  return (
    <div className="space-y-7 text-white">
      <div>
        <p className="mb-2 font-sans text-[11px] tracking-[0.2em] text-white/40 uppercase">
          Reading
        </p>
        <h2 className="font-display text-[38px] leading-[1.1]">Bookshelf</h2>
      </div>

      <div className="h-px bg-white/10" />

      <div className="space-y-4">
        {BOOKS.map((book) => (
          <div
            key={book.title}
            className="rounded-2xl border border-white/10 bg-white/5 p-5"
          >
            <div className="mb-3 flex items-center gap-3">
              <span className="text-2xl">{book.emoji}</span>
              <div>
                <p className="font-sans text-sm font-semibold leading-snug text-white/90">
                  {book.title}
                </p>
                <p className="font-sans text-[11px] text-white/40">{book.author}</p>
              </div>
            </div>
            <p className="font-sans text-sm leading-relaxed text-white/55 italic">
              &ldquo;{book.thought}&rdquo;
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
