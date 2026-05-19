import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Twitter, Send, MessageCircle, Mail, ExternalLink, Heart, Zap } from 'lucide-react'

const socialLinks = [
  { icon: Twitter, label: 'Twitter/X', href: 'https://twitter.com/razzshares', color: '#1da1f2' },
  { icon: Send, label: 'Telegram', href: 'https://t.me/razzshares', color: '#0088cc' },
  { icon: MessageCircle, label: 'Discord', href: 'https://discord.gg/razzshares', color: '#5865f2' },
  { icon: Mail, label: 'Email', href: 'mailto:razzshares@gmail.com', color: '#00d4ff' },
]

const navLinks = [
  { label: 'Home', path: '/' },
  { label: 'Portfolio', path: '/portfolio' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export default function Footer() {
  return (
    <footer
      className="relative mt-20 border-t border-white/5"
      style={{ background: 'rgba(2, 4, 8, 0.95)' }}
    >
      {/* Top glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, #00d4ff, #7c3aed, transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center text-sm font-display font-bold"
                style={{
                  background: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
                  boxShadow: '0 0 15px rgba(0,212,255,0.3)',
                }}
              >
                R
              </div>
              <span className="font-display font-bold text-lg neon-text">RazzShares</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-5 max-w-xs">
              Web3 Content Creator & Community Moderator. Helping crypto projects grow through content, engagement, and ecosystem building.
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {socialLinks.map(({ icon: Icon, label, href, color }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = color + '60'
                    e.currentTarget.style.background = color + '15'
                    e.currentTarget.style.boxShadow = `0 0 15px ${color}30`
                    e.currentTarget.style.color = color
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.color = ''
                  }}
                >
                  <Icon size={15} className="text-gray-400" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {navLinks.map(link => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-gray-500 hover:text-cyan-400 text-sm transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 h-px bg-cyan-400 transition-all duration-300 group-hover:w-3" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Get In Touch</h4>
            <div className="space-y-3">
              <a
                href="mailto:razzshares@gmail.com"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
              >
                <Mail size={14} />
                razzshares@gmail.com
              </a>
              <a
                href="https://t.me/razzshares"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-cyan-400 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Send size={14} />
                t.me/razzshares
              </a>
              <div className="mt-4">
                <Link to="/contact" className="btn-primary text-white text-xs py-2 px-4">
                  <Zap size={12} />
                  Start a Project
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-gray-600 text-xs">
            © {new Date().getFullYear()} RazzShares. All rights reserved.
          </p>
          <p className="text-gray-700 text-xs flex items-center gap-1">
            Built with <Heart size={10} className="text-pink-500 fill-pink-500" /> for the Web3 ecosystem
          </p>
        </div>
      </div>
    </footer>
  )
}
