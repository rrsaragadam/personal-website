'use client'

import { useCallback, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { registerAct } from './scroll'

// One act of the film: `length` (a height class such as h-[300svh]) tall, with a viewport-sized frame pinned
// inside it while the act plays.
export function Act({
  id,
  length,
  label,
  className,
  children,
}: {
  id: string
  length: string
  label: string
  className?: string
  children: ReactNode
}) {
  const ref = useCallback((el: HTMLElement | null) => registerAct(id, el), [id])

  return (
    <section
      ref={ref}
      id={id}
      aria-label={label}
      className={cn('relative', length)}
    >
      <div
        className={cn('sticky top-0 h-svh w-full overflow-hidden', className)}
      >
        {children}
      </div>
    </section>
  )
}
