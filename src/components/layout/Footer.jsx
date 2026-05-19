import { Link } from 'react-router-dom'
import { Twitter, Send, MessageCircle, Mail, Heart, Zap, Lock, ArrowUpRight } from 'lucide-react'

const socialLinks = [
  { icon: Twitter,        label: 'Twitter/X', href: 'https://twitter.com/razzshares', color: '#1da1f2' },
  { icon: Send,           label: 'Telegram',  href: 'https://t.me/razzshares',        color: '#0088cc' },
  { icon: MessageCircle,  label: 'Discord',   href: 'https://discord.gg/razzshares',  color: '#5865f2' },
  { icon: Mail,           label: 'Email',     href: 'mailto:razzshares@gmail.com',    color: '#00d4ff' },
]

const navLinks = [
  { label: 'Home',      path: '/'          },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'About',     path: '/about'     },
  { label: 'Contact',   path: '/contact'   },
]

const services = [
  'Content Creation',
  'Community Moderation',
  'Ambassador Campaigns',
  'Growth Strategy',
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer
      className="relative mt-24 border-t border-white/5"
      style={{ background: 'rgba(2,4,8,0.97)' }}
    >
      {/* Top glow line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #7c3aed, #f472b6, transparent)' }}
      />

      {/* Subtle glow blob */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.04) 0%, transparent 70%)', filter: 'blur(20px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand col */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-display font-black flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 15px rgba(0,212,255,0.3)',
                }}
              >
                R
              </div>
              <span className="font-display font-bold text-lg neon-text">RazzShares</span>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-[220px]">
              Web3 Content Creator & Community Moderator. Helping crypto projects grow.
            </p>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socialLinks.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = color + '55'
                    e.currentTarget.style.background = color + '12'
                    e.currentTarget.style.boxShadow = `0 0 14px ${color}30`
                    e.currentTarget.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.transform = ''
                  }}
                >
                  <Icon size={14} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors duration-200 group"
                  >
                    <span className="w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-3 flex-shrink-0" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {services.map(s => (
                <li key={s}>
                  <Link
                    to="/contact"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-purple-400 transition-colors duration-200 group"
                  >
                    <span className="w-0 h-px bg-purple-400 transition-all duration-300 group-hover:w-3 flex-shrink-0" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Get In Touch</h4>
            <div className="space-y-3 mb-5">
              <a
                href="mailto:razzshares@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <Mail size={13} className="flex-shrink-0" />
                razzshares@gmail.com
              </a>
              <a
                href="https://t.me/razzshares"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <Send size={13} className="flex-shrink-0" />
                t.me/razzshares
              </a>
              <a
                href="https://twitter.com/razzshares"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <Twitter size={13} className="flex-shrink-0" />
                @razzshares
              </a>
            </div>
            <Link to="/contact" className="btn-primary text-white text-xs py-2 px-4 inline-flex">
              <Zap size={11} />
              Start a Project
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="pt-6 border-t border-white/[0.05] flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-gray-700 text-xs">
            © {year} RazzShares. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <p className="text-gray-700 text-xs flex items-center gap-1">
              Built with <Heart size={9} className="text-pink-500 fill-pink-500 mx-0.5" /> for the Web3 ecosystem
            </p>
            <Link
              to="/admin"
              className="flex items-center gap-1 text-gray-800 hover:text-gray-600 text-xs transition-colors"
            >
              <Lock size={9} />
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
