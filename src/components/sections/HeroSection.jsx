import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Twitter, Send, MessageCircle, Mail, ChevronDown, Sparkles, Zap } from 'lucide-react'
import { TypeAnimation } from 'react-type-animation'

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
    transition: { staggerChildren: 0.12, delayChildren: 0.2 },
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
        className="glow-orb w-[700px] h-[700px] -top-60 -left-60 opacity-10"
        style={{ background: 'radial-gradient(circle, #00d4ff, transparent 70%)' }}
      />
      <div
        className="glow-orb w-[600px] h-[600px] -bottom-60 -right-60 opacity-08"
        style={{ background: 'radial-gradient(circle, #7c3aed, transparent 70%)' }}
      />
      <div
        className="glow-orb w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5"
        style={{ background: 'radial-gradient(circle, #f472b6, transparent 70%)' }}
      />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">

          {/* ── Left content ── */}
          <motion.div
            className="flex-1 text-center lg:text-left max-w-2xl"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Availability badge */}
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mb-7">
              <div
                className="flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-medium badge-pulse"
                style={{
                  background: 'rgba(0,212,255,0.07)',
                  border: '1px solid rgba(0,212,255,0.2)',
                }}
              >
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse flex-shrink-0" />
                <span className="text-cyan-400">Available for Web3 Projects</span>
                <Sparkles size={11} className="text-cyan-400/70" />
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-bold leading-[1.1] mb-4"
            >
              <span className="text-white">Web3 </span>
              <span className="neon-text">Content</span>
              <br />
              <span className="text-white">Creator</span>
              <span className="text-white"> & </span>
              <span className="neon-text">Community</span>
              <br />
              <span className="text-white">Moderator</span>
            </motion.h1>

            {/* Animated role typewriter */}
            <motion.div
              variants={itemVariants}
              className="mb-5 font-mono text-sm"
              style={{ color: '#00d4ff' }}
            >
              <span className="text-gray-600">{'> '}</span>
              <TypeAnimation
                sequence={[
                  'DeFi Community Builder', 2000,
                  'NFT Ambassador', 2000,
                  'Crypto Thread Writer', 2000,
                  'Growth Strategist', 2000,
                  'Web3 Native Creator', 2000,
                ]}
                wrapper="span"
                speed={50}
                repeat={Infinity}
                className="typewriter-cursor"
              />
            </motion.div>

            {/* Subheadline */}
            <motion.p
              variants={itemVariants}
              className="text-lg sm:text-xl text-gray-400 leading-relaxed mb-8 max-w-xl mx-auto lg:mx-0"
            >
              Helping crypto projects grow through{' '}
              <span className="text-cyan-400 font-medium">content</span>,{' '}
              <span className="text-purple-400 font-medium">engagement</span>, and{' '}
              <span className="text-pink-400 font-medium">ecosystem building</span>.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10"
            >
              <Link to="/portfolio" className="btn-primary text-white w-full sm:w-auto justify-center group">
                View Portfolio
                <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link to="/contact" className="btn-secondary w-full sm:w-auto justify-center">
                <Zap size={14} />
                Contact Me
              </Link>
            </motion.div>

            {/* Social links */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center lg:justify-start gap-3"
            >
              <span className="text-gray-600 text-xs font-mono">find me:</span>
              {socialLinks.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = color + '70'
                    e.currentTarget.style.background = color + '12'
                    e.currentTarget.style.boxShadow = `0 0 16px ${color}35`
                    e.currentTarget.style.transform = 'translateY(-3px) scale(1.05)'
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

          {/* ── Right: Profile image ── */}
          <motion.div
            className="flex-shrink-0 relative"
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.9, delay: 0.4, ease: 'backOut' }}
          >
            <div className="relative w-64 h-64 sm:w-80 sm:h-80 lg:w-[380px] lg:h-[380px]">

              {/* Slow spinning outer ring */}
              <motion.div
                className="absolute -inset-5 rounded-full opacity-25"
                style={{
                  background: 'conic-gradient(from 0deg, #00d4ff, #7c3aed, #f472b6, #00d4ff)',
                  filter: 'blur(3px)',
                }}
                animate={{ rotate: 360 }}
                transition={{ duration: 24, repeat: Infinity, ease: 'linear' }}
              />

              {/* Counter-rotating ring */}
              <motion.div
                className="absolute -inset-2 rounded-full"
                style={{
                  background: 'conic-gradient(from 180deg, transparent 70%, rgba(0,212,255,0.6) 85%, transparent 100%)',
                }}
                animate={{ rotate: -360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
              />

              {/* Profile circle */}
              <motion.div
                className="relative w-full h-full rounded-full overflow-hidden"
                style={{
                  border: '2px solid rgba(0,212,255,0.3)',
                  boxShadow: '0 0 50px rgba(0,212,255,0.18), 0 0 100px rgba(124,58,237,0.12), inset 0 0 50px rgba(0,212,255,0.04)',
                }}
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              >
                {/* Inner gradient bg */}
                <div
                  className="w-full h-full flex flex-col items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, #070f1f 0%, #0c1930 40%, #10203e 100%)',
                  }}
                >
                  {/* Hex grid pattern inside */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,212,255,0.4) 1px, transparent 0)',
                      backgroundSize: '20px 20px',
                    }}
                  />
                  {/* Avatar initial */}
                  <div
                    className="relative z-10 w-28 h-28 rounded-2xl flex items-center justify-center text-6xl font-display font-black"
                    style={{
                      background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))',
                      border: '1px solid rgba(0,212,255,0.25)',
                      color: '#00d4ff',
                      textShadow: '0 0 30px rgba(0,212,255,0.6)',
                    }}
                  >
                    R
                  </div>
                  <p className="relative z-10 text-gray-600 text-xs font-mono mt-3">@razzshares</p>
                </div>
              </motion.div>

              {/* Floating badge — top right */}
              <motion.div
                className="absolute -top-5 -right-5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap"
                style={{
                  background: 'rgba(0,212,255,0.12)',
                  border: '1px solid rgba(0,212,255,0.3)',
                  backdropFilter: 'blur(12px)',
                  color: '#00d4ff',
                  boxShadow: '0 0 20px rgba(0,212,255,0.15)',
                }}
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                🚀 Web3 Native
              </motion.div>

              {/* Floating badge — bottom left */}
              <motion.div
                className="absolute -bottom-5 -left-5 px-3.5 py-2 rounded-2xl text-xs font-semibold whitespace-nowrap"
                style={{
                  background: 'rgba(124,58,237,0.12)',
                  border: '1px solid rgba(124,58,237,0.35)',
                  backdropFilter: 'blur(12px)',
                  color: '#c4b5fd',
                  boxShadow: '0 0 20px rgba(124,58,237,0.15)',
                }}
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              >
                ⚡ 50+ Projects
              </motion.div>

              {/* Small orbiting dot */}
              <motion.div
                className="absolute"
                style={{ top: '50%', left: '50%', marginTop: '-6px', marginLeft: '-6px' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    background: '#f472b6',
                    boxShadow: '0 0 10px #f472b6',
                    transform: 'translateX(210px)',
                  }}
                />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <span className="text-gray-600 text-xs font-mono tracking-widest uppercase">scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-gray-700"
          >
            <ChevronDown size={16} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
