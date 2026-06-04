'use client'

import { useRef, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { gsap } from 'gsap'
import { useSceneStore, type SceneObject } from '@/store/useSceneStore'
import { AboutPanel } from './panels/AboutPanel'
import { WorkPanel } from './panels/WorkPanel'
import { ProjectsPanel } from './panels/ProjectsPanel'
import { ReadingPanel } from './panels/ReadingPanel'

function PanelContent({ panel }: { panel: SceneObject }) {
  if (panel === 'laptop') return <AboutPanel />
  if (panel === 'monitor') return <WorkPanel />
  if (panel === 'ipad') return <ProjectsPanel />
  if (panel === 'books') return <ReadingPanel />
  return null
}

export function PanelOverlay() {
  const panelRef = useRef<HTMLDivElement>(null)
  const backdropRef = useRef<HTMLDivElement>(null)
  const prevActiveRef = useRef<SceneObject>(null)
  const [visiblePanel, setVisiblePanel] = useState<SceneObject>(null)

  const activeObject = useSceneStore((s) => s.activeObject)
  const setActiveObject = useSceneStore((s) => s.setActiveObject)

  const handleClose = () => setActiveObject(null)

  useEffect(() => {
    const isOpening = activeObject !== null && activeObject !== prevActiveRef.current
    const isClosing = activeObject === null && prevActiveRef.current !== null

    if (isOpening) {
      setVisiblePanel(activeObject)
      prevActiveRef.current = activeObject

      if (panelRef.current) {
        gsap.fromTo(
          panelRef.current,
          { x: 60, opacity: 0, filter: 'blur(10px)' },
          { x: 0, opacity: 1, filter: 'blur(0px)', duration: 0.6, ease: 'power2.out', delay: 1.0 }
        )
      }
      if (backdropRef.current) {
        gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 1.0 })
      }
    } else if (isClosing) {
      prevActiveRef.current = null

      if (panelRef.current) {
        gsap.to(panelRef.current, {
          x: 60,
          opacity: 0,
          filter: 'blur(8px)',
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => setVisiblePanel(null),
        })
      }
      if (backdropRef.current) {
        gsap.to(backdropRef.current, { opacity: 0, duration: 0.3 })
      }
    }
  }, [activeObject])

  if (visiblePanel === null && activeObject === null) return null

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={handleClose}
        className="fixed inset-0 z-40 opacity-0"
        style={{ background: 'rgba(0,0,0,0.15)' }}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed right-8 top-1/2 z-50 flex max-h-[80vh] w-[420px] -translate-y-1/2 flex-col overflow-hidden rounded-[28px] border border-white/[0.18] opacity-0 shadow-[0_8px_32px_rgba(0,0,0,0.25)]"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-7 py-5">
          <div className="h-1.5 w-1.5 rounded-full bg-white/40" />
          <button
            onClick={handleClose}
            className="rounded-full border border-white/20 bg-white/10 p-1.5 text-white/60 transition-colors hover:bg-white/20 hover:text-white"
            aria-label="Close panel"
          >
            <X size={14} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-7 py-6">
          <PanelContent panel={visiblePanel} />
        </div>
      </div>
    </>
  )
}
