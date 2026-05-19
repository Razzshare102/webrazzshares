import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Twitter, Send, MessageCircle, Mail, ChevronDown, Sparkles } from 'lucide-react'

const socialLinks = [
  { icon: Twitter, label: 'Twitter/X', href: 'https://twitter.com/razzshares', color: '#1da1f2' },
  { icon: Send, label: 'Telegram', href: 'https://t.me/razzshares', color: '#0088cc' },
  { icon: MessageCircle, label: 'Discord', href: 'https://discord.gg/razzshares', color: '#5865f2' },
  { icon: Mail, label: 'Email', href: 'mailto:razzshares@gmail.com', color: '#00d4ff' },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.2 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background orbs */}
      <div
        className="glow-orb w-[600px] h-[600px] -top-40 -left-40 opacity-15"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }}
      />
      <div
        className="glow-orb w-[500px] h-[500px] -bottom-40 -right-40 opacity-10"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-20">
          {/* Left content */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-6">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(0,212,255,0.08)',
                  border: '1px solid rgba(0,212,255,0.2)',
                }}
              >
                <Sparkles size={12} className="text-cyan-400" />
                <span className="text-cyan-400">Available for Web3 Projects</span>
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-tight mb-6"
            >
              <span className="text-white">Web3 </span>
              <span className="neon-text">Content Creator</span>
              <span className="text-white"> &</span>
              <br />
              <span className="text-white">Community </span>
              <span
                className="text-white"
                style={{ textShadow: '0 0 30px rgba(0,212,255,0.3)' }}
              >
                Moderator
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Helping crypto projects grow through{' '}
              <span className="text-cyan-400">content</span>,{' '}
              <span className="text-purple-400">engagement</span>, and{' '}
              <span className="text-pink-400">ecosystem building</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link to="/portfolio" className="btn-primary text-white w-full sm:w-auto justify-center">
                View Portfolio
                <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-secondary w-full sm:w-auto justify-center">
                Contact Me
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-3"
            >
              <span className="text-gray-600 text-xs">Find me on:</span>
              {socialLinks.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = color + '60'
                    e.currentTarget.style.background = color + '15'
                    e.currentTarget.style.boxShadow = `0 0 15px ${color}40`
                    e.currentTarget.style.transform = 'translateY(-3px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.transform = ''
                  }}
                >
                  <Icon size={16} className="text-gray-400 transition-colors group-hover:text-white" />
                </a>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Profile image */}
          <motion.div
            className="flex-shrink-0"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'backOut' }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Outer glow ring */}
              <div
                className="absolute -inset-4 rounded-full animate-spin-slow opacity-30"
                style={{
                  background: 'conic-gradient(from 0deg, #00d4ff, #7c3aed, #f472b6, #00d4ff)',
                  filter: 'blur(2px)',
                }}
              />

              {/* Middle ring */}
              <div
                className="absolute -inset-2 rounded-full"
                style={{
                  background: 'conic-gradient(from 0deg, transparent 60%, #00d4ff 80%, transparent 100%)',
                  animation: 'spin 8s linear infinite reverse',
                }}
              />

              {/* Profile circle */}
              <div
                className="relative w-full h-full rounded-full overflow-hidden animate-float"
                style={{
                  border: '2px solid rgba(0,212,255,0.3)',
                  boxShadow: '0 0 40px rgba(0,212,255,0.2), 0 0 80px rgba(124,58,237,0.15), inset 0 0 40px rgba(0,212,255,0.05)',
                }}
              >
                {/* Placeholder gradient profile */}
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #0a1628 0%, #152540 50%, #0a1628 100%)',
                  }}
                >
                  {/* Avatar placeholder */}
                  <div className="text-center">
                    <div
                      className="w-28 h-28 rounded-full mx-auto mb-4 flex items-center justify-center text-5xl font-display font-bold"
                      style={{
                        background: 'linear-gradient(135deg, #00d4ff20, #7c3aed20)',
                        border: '2px solid rgba(0,212,255,0.2)',
                        color: '#00d4ff',
                      }}
                    >
                      R
                    </div>
                    <p className="text-gray-500 text-xs font-mono">profile.png</p>
                  </div>
                </div>
              </div>

              {/* Floating badges */}
              <motion.div
                className="absolute -top-4 -right-4 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(0,212,255,0.15)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  backdropFilter: 'blur(10px)',
                  color: '#00d4ff',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                🚀 Web3 Native
              </motion.div>

              <motion.div
                className="absolute -bottom-4 -left-4 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  background: 'rgba(124,58,237,0.15)',
                  border: '1px solid rgba(124,58,237,0.3)',
                  backdropFilter: 'blur(10px)',
                  color: '#a78bfa',
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity }}
              >
                ⚡ 50+ Projects
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <span className="text-xs font-mono">scroll down</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
