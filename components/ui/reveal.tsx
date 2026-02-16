'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/components/ui/cn'

export function Reveal(props: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [hidden, setHidden] = useState(false)

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reducedMotion) {
      setHidden(false)
      return
    }

    const node = ref.current
    if (!node) return

    const initiallyInView = node.getBoundingClientRect().top <= window.innerHeight - 50
    setHidden(!initiallyInView)

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting) {
          setHidden(false)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className={cn('reveal', hidden ? 'reveal-hidden' : 'reveal-visible', props.className)}>
      {props.children}
    </div>
  )
}
