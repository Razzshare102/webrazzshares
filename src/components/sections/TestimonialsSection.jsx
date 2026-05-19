import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import { useTestimonials } from '../../hooks/useSupabase'

// Fallback demo testimonials
const DEMO_TESTIMONIALS = [
  {
    id: 1,
    name: 'Alex Chen',
    position: 'Founder & CEO',
    company: 'DeFi Protocol X',
    feedback: 'RazzShares transformed our community engagement. Their content threads consistently hit 10K+ impressions and the community moderation quality is unmatched. Absolutely recommended for any serious Web3 project.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Sarah Williams',
    position: 'Head of Marketing',
    company: 'NFT Marketplace Y',
    feedback: 'Working with RazzShares on our ambassador campaign was a game-changer. They brought in genuine community advocates and our holder count grew 3x in 2 months. Professional, reliable, and results-driven.',
    rating: 5,
  },
  {
    id: 3,
    name: 'Marcus Rodriguez',
    position: 'Co-Founder',
    company: 'Layer2 Project Z',
    feedback: 'The growth strategy RazzShares developed for us was spot-on. Deep understanding of crypto ecosystems, excellent content quality, and the community moderation kept our Telegram and Discord thriving even during bear market.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Priya Sharma',
    position: 'CMO',
    company: 'Web3 Gaming Studio',
    feedback: 'RazzShares is one of the best Web3 community builders I\'ve worked with. Their threads go viral regularly, they understand the space deeply, and their engagement rates are consistently outstanding.',
    rating: 5,
  },
]

function StarRating({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(count)].map((_, i) => (
        <Star key={i} size={14} className="text-yellow-400 fill-yellow-400" />
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const { data: dbTestimonials, loading } = useTestimonials()
  const testimonials = dbTestimonials.length > 0 ? dbTestimonials : DEMO_TESTIMONIALS

  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const [autoplay, setAutoplay] = useState(true)

  const goNext = useCallback(() => {
    setDirection(1)
    setCurrent(prev => (prev + 1) % testimonials.length)
  }, [testimonials.length])

  const goPrev = useCallback(() => {
    setDirection(-1)
    setCurrent(prev => (prev - 1 + testimonials.length) % testimonials.length)
  }, [testimonials.length])

  // Autoplay
  useEffect(() => {
    if (!autoplay || testimonials.length <= 1) return
    const timer = setInterval(goNext, 5000)
    return () => clearInterval(timer)
  }, [autoplay, goNext, testimonials.length])

  const slideVariants = {
    enter: (dir) => ({
      x: dir > 0 ? 60 : -60,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir) => ({
      x: dir > 0 ? -60 : 60,
      opacity: 0,
    }),
  }

  const current_t = testimonials[current]

  return (
    <section className="relative py-24 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 30% 70%, rgba(0,212,255,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
          >
            Client Love
          </div>
          <h2 className="section-heading neon-text mb-4">Testimonials</h2>
          <p className="text-gray-500 text-lg">What project founders say about working with me</p>
        </ScrollReveal>

        <ScrollReveal>
          <div
            className="relative p-8 lg:p-12 rounded-3xl overflow-hidden"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.07)',
              backdropFilter: 'blur(20px)',
            }}
            onMouseEnter={() => setAutoplay(false)}
            onMouseLeave={() => setAutoplay(true)}
          >
            {/* Top glow */}
            <div
              className="absolute top-0 left-0 right-0 h-px"
              style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }}
            />

            {/* Quote icon */}
            <div
              className="absolute top-8 right-8 opacity-10"
              style={{ color: '#00d4ff' }}
            >
              <Quote size={60} />
            </div>

            {/* Testimonial content */}
            <div className="relative min-h-[200px]">
              <AnimatePresence custom={direction} mode="wait">
                <motion.div
                  key={current_t?.id || current}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <StarRating count={current_t?.rating || 5} />

                  <blockquote className="mt-6 text-lg lg:text-xl text-gray-300 leading-relaxed font-light italic mb-8">
                    "{current_t?.feedback}"
                  </blockquote>

                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #00d4ff20, #7c3aed20)',
                        border: '2px solid rgba(0,212,255,0.2)',
                        color: '#00d4ff',
                      }}
                    >
                      {current_t?.name?.[0] || 'A'}
                    </div>

                    <div>
                      <p className="font-semibold text-white">{current_t?.name}</p>
                      <p className="text-gray-500 text-sm">
                        {current_t?.position}{current_t?.company ? ` · ${current_t.company}` : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between mt-8">
              {/* Dots */}
              <div className="flex gap-2">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setDirection(i > current ? 1 : -1)
                      setCurrent(i)
                    }}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: i === current ? '24px' : '8px',
                      height: '8px',
                      background: i === current
                        ? 'linear-gradient(90deg, #00d4ff, #7c3aed)'
                        : 'rgba(255,255,255,0.15)',
                    }}
                    aria-label={`Go to testimonial ${i + 1}`}
                  />
                ))}
              </div>

              {/* Arrow buttons */}
              <div className="flex gap-3">
                <button
                  onClick={goPrev}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#9ca3af',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
                    e.currentTarget.style.color = '#00d4ff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = '#9ca3af'
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={goNext}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#9ca3af',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'
                    e.currentTarget.style.color = '#00d4ff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.color = '#9ca3af'
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
