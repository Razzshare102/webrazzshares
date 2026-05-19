import { useEffect, useRef } from 'react'

export default function CursorGlow() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX = 0, ringY = 0
    let animId

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX - 4 + 'px'
      dot.style.top = mouseY - 4 + 'px'
    }

    const animate = () => {
      ringX += (mouseX - ringX - 16) * 0.12
      ringY += (mouseY - ringY - 16) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top = ringY + 'px'
      animId = requestAnimationFrame(animate)
    }

    const onMouseEnter = (e) => {
      if (e.target.closest('a, button, [role="button"]')) {
        dot.style.transform = 'scale(2)'
        ring.style.width = '48px'
        ring.style.height = '48px'
        ring.style.borderColor = 'rgba(124, 58, 237, 0.8)'
      }
    }

    const onMouseLeave = (e) => {
      if (e.target.closest('a, button, [role="button"]')) {
        dot.style.transform = 'scale(1)'
        ring.style.width = '32px'
        ring.style.height = '32px'
        ring.style.borderColor = 'rgba(0, 212, 255, 0.5)'
      }
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseEnter)
    document.addEventListener('mouseout', onMouseLeave)
    animate()

    // Hide default cursor
    document.documentElement.style.cursor = 'none'

    return () => {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseEnter)
      document.removeEventListener('mouseout', onMouseLeave)
      cancelAnimationFrame(animId)
      document.documentElement.style.cursor = 'auto'
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  )
}
