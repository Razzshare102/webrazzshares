import { useRef } from 'react'
import { useInView } from 'framer-motion'
import { motion } from 'framer-motion'
import AnimatedCounter from '../ui/AnimatedCounter'
import ScrollReveal from '../ui/ScrollReveal'
import { Briefcase, TrendingUp, Users, FileText } from 'lucide-react'
import { useHomepageContent } from '../../hooks/useSupabase'

const DEFAULT_STATS = [
  { icon: Briefcase, label: 'Projects Worked With', value: '50', suffix: '+', color: '#00d4ff', bg: 'rgba(0,212,255,0.06)', border: 'rgba(0,212,255,0.15)' },
  { icon: TrendingUp, label: 'Campaign Reach',       value: '500', suffix: 'K+', color: '#7c3aed', bg: 'rgba(124,58,237,0.06)', border: 'rgba(124,58,237,0.15)' },
  { icon: Users,      label: 'Communities Managed',  value: '30',  suffix: '+', color: '#f472b6', bg: 'rgba(244,114,182,0.06)', border: 'rgba(244,114,182,0.15)' },
  { icon: FileText,   label: 'Threads Written',       value: '1000',suffix: '+', color: '#34d399', bg: 'rgba(52,211,153,0.06)', border: 'rgba(52,211,153,0.15)' },
]

export default function StatsSection() {
  const { content } = useHomepageContent()

  const stats = DEFAULT_STATS.map((s, i) => {
    const keys = ['stats_projects', 'stats_reach', 'stats_communities', 'stats_threads']
    return { ...s, value: content[keys[i]] || s.value }
  })

  return (
    <section className="relative py-20 overflow-hidden">
      {/* Top divider */}
      <div className="glow-divider mb-0 opacity-40" />

      {/* Background pulse */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(0,212,255,0.03) 0%, transparent 60%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', color: '#67e8f9' }}
          >
            By The Numbers
          </span>
          <h2 className="section-heading neon-text mb-3">Results That Speak</h2>
          <p className="text-gray-500 text-base max-w-md mx-auto">Consistent impact across 50+ Web3 projects, communities, and campaigns</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div
                  className="relative p-6 lg:p-7 text-center rounded-2xl group cursor-default overflow-hidden transition-all duration-300"
                  style={{
                    background: stat.bg,
                    border: `1px solid ${stat.border}`,
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-6px)'
                    e.currentTarget.style.boxShadow = `0 0 30px ${stat.color}20, 0 12px 40px rgba(0,0,0,0.4)`
                    e.currentTarget.style.borderColor = stat.color + '50'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = ''
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.borderColor = stat.border
                  }}
                >
                  {/* Top glow line */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-px"
                    style={{ background: stat.color }}
                  />

                  {/* Icon */}
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                    style={{
                      background: `${stat.color}15`,
                      border: `1px solid ${stat.color}30`,
                    }}
                  >
                    <Icon size={20} style={{ color: stat.color }} />
                  </div>

                  {/* Counter */}
                  <div
                    className="text-4xl lg:text-5xl font-display font-bold mb-2 number-glow"
                    style={{ color: stat.color }}
                  >
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-gray-400 text-xs sm:text-sm font-medium leading-snug">{stat.label}</p>
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>

      {/* Bottom divider */}
      <div className="glow-divider mt-16 opacity-30" />
    </section>
  )
}
