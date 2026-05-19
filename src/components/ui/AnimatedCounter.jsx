import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'

export default function AnimatedCounter({ target, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })
  const hasAnimated = useRef(false)

  // Parse numeric part
  const numericTarget = parseFloat(target.toString().replace(/[^0-9.]/g, ''))
  const nonNumericSuffix = target.toString().replace(/[0-9.]/g, '')

  useEffect(() => {
    if (!isInView || hasAnimated.current) return
    hasAnimated.current = true

    const startTime = Date.now()
    const endValue = numericTarget

    const tick = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * endValue)
      setCount(current)

      if (progress < 1) {
        requestAnimationFrame(tick)
      }
    }

    requestAnimationFrame(tick)
  }, [isInView, numericTarget, duration])

  return (
    <span ref={ref}>
      {prefix}{count}{nonNumericSuffix}{suffix}
    </span>
  )
}
