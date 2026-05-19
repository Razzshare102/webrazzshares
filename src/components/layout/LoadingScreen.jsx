import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const WORDS = ['Web3', 'Creator', 'Community', 'Portfolio', 'RazzShares']

export default function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0)
  const [wordIdx,  setWordIdx]  = useState(0)
  const [done,     setDone]     = useState(false)

  useEffect(() => {
    // Progress ticker
    const interval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.random() * 18 + 4
        if (next >= 100) {
          clearInterval(interval)
          setProgress(100)
          setDone(true)
          setTimeout(onComplete, 600)
          return 100
        }
        return next
      })
    }, 110)

    // Cycle words
    const wordTimer = setInterval(() => {
      setWordIdx(i => (i + 1) % WORDS.length)
    }, 500)

    return () => { clearInterval(interval); clearInterval(wordTimer) }
  }, [onComplete])

  const pct = Math.min(Math.round(progress), 100)

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center select-none"
      style={{ background: '#020408' }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Background radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at center, rgba(0,212,255,0.06) 0%, transparent 65%)' }}
      />

      {/* Grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Logo with orbit ring */}
      <div className="relative mb-8">
        {/* Orbit ring */}
        <motion.div
          className="absolute -inset-4 rounded-full"
          style={{ border: '1px solid rgba(0,212,255,0.15)' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />
        {/* Orbit dot */}
        <motion.div
          className="absolute"
          style={{ top: '-16px', left: '50%', marginLeft: '-4px' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        >
          <div
            style={{
              width: 8, height: 8, borderRadius: '50%',
              background: '#00d4ff', boxShadow: '0 0 8px #00d4ff',
            }}
          />
        </motion.div>

        {/* Logo box */}
        <motion.div
          initial={{ opacity: 0, scale: 0.4, rotate: -10 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.7, ease: 'backOut' }}
          className="w-24 h-24 rounded-2xl flex items-center justify-center text-4xl font-display font-black relative z-10"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
            boxShadow: '0 0 50px rgba(0,212,255,0.4), 0 0 100px rgba(124,58,237,0.2)',
          }}
        >
          R
        </motion.div>
      </div>

      {/* Brand name */}
      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl font-display font-bold mb-1 neon-text"
      >
        RazzShares
      </motion.h1>

      {/* Cycling subtitle */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="h-5 mb-10 overflow-hidden"
      >
        <motion.p
          key={wordIdx}
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -12, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="text-gray-500 text-sm font-mono text-center"
        >
          {WORDS[wordIdx]}
        </motion.p>
      </motion.div>

      {/* Progress bar */}
      <div className="w-56 space-y-2">
        <div className="h-[3px] rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00d4ff, #7c3aed, #f472b6)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.12, ease: 'linear' }}
          />
        </div>

        <div className="flex items-center justify-between">
          <motion.span
            className="text-xs font-mono text-gray-600"
            animate={{ opacity: done ? 0 : [0.5, 1, 0.5] }}
            transition={{ duration: 1.2, repeat: done ? 0 : Infinity }}
          >
            {done ? 'Ready' : 'Loading…'}
          </motion.span>
          <span className="text-xs font-mono text-gray-600">{pct}%</span>
        </div>
      </div>

      {/* Three floating accent dots */}
      {[
        { color: '#00d4ff', left: '15%', top: '25%', delay: 0   },
        { color: '#7c3aed', left: '80%', top: '35%', delay: 0.4 },
        { color: '#f472b6', left: '50%', top: '75%', delay: 0.8 },
      ].map(({ color, left, top, delay }) => (
        <motion.div
          key={color}
          className="absolute w-1.5 h-1.5 rounded-full pointer-events-none"
          style={{ left, top, background: color, boxShadow: `0 0 8px ${color}` }}
          animate={{ y: [0, -18, 0], opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2.5, repeat: Infinity, delay, ease: 'easeInOut' }}
        />
      ))}
    </motion.div>
  )
}
