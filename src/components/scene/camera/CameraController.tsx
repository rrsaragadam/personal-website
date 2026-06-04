'use client'

import { useEffect, useRef } from 'react'
import { useThree } from '@react-three/fiber'
import { gsap } from 'gsap'
import { useSceneStore } from '@/store/useSceneStore'
import { CAMERA_TARGETS } from '@/lib/cameraTargets'

export function CameraController() {
  const { camera } = useThree()
  const { activeObject, setTransitioning } = useSceneStore()
  const lookAtProxy = useRef({ x: 0.5, y: 0.5, z: 0 })

  useEffect(() => {
    const t = activeObject ? CAMERA_TARGETS[activeObject] : CAMERA_TARGETS.default

    setTransitioning(true)

    gsap.killTweensOf(camera.position)
    gsap.killTweensOf(lookAtProxy.current)

    gsap.to(camera.position, {
      x: t.pos[0],
      y: t.pos[1],
      z: t.pos[2],
      duration: 1.4,
      ease: 'power3.inOut',
    })

    gsap.to(lookAtProxy.current, {
      x: t.lookAt[0],
      y: t.lookAt[1],
      z: t.lookAt[2],
      duration: 1.4,
      ease: 'power3.inOut',
      onUpdate: () => {
        camera.lookAt(lookAtProxy.current.x, lookAtProxy.current.y, lookAtProxy.current.z)
      },
      onComplete: () => setTransitioning(false),
    })
  }, [activeObject, camera, setTransitioning])

  return null
}
