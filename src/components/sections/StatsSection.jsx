import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'
import AnimatedCounter from '../ui/AnimatedCounter'
import ScrollReveal from '../ui/ScrollReveal'
import { Briefcase, TrendingUp, Users, FileText } from 'lucide-react'

const stats = [
  {
    icon: Briefcase,
    label: 'Projects Worked With',
    value: '50',
    suffix: '+',
    color: '#00d4ff',
    gradient: 'from-cyan-500/20 to-blue-500/10',
  },
  {
    icon: TrendingUp,
    label: 'Campaign Reach',
    value: '500',
    suffix: 'K+',
    color: '#7c3aed',
    gradient: 'from-purple-500/20 to-indigo-500/10',
  },
  {
    icon: Users,
    label: 'Communities Managed',
    value: '30',
    suffix: '+',
    color: '#f472b6',
    gradient: 'from-pink-500/20 to-rose-500/10',
  },
  {
    icon: FileText,
    label: 'Threads Written',
    value: '1000',
    suffix: '+',
    color: '#34d399',
    gradient: 'from-emerald-500/20 to-green-500/10',
  },
]

export default function StatsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Divider line */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.2), transparent)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-12">
          <h2 className="section-heading neon-text mb-3">By The Numbers</h2>
          <p className="text-gray-500 text-lg">Results that speak for themselves</p>
        </ScrollReveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon
            return (
              <ScrollReveal key={stat.label} delay={i * 0.1}>
                <div className="glass-card-hover p-6 text-center group cursor-default relative overflow-hidden">
                  {/* Background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl`}
                  />

                  {/* Icon */}
                  <div
                    className="relative w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `${stat.color}15`,
                      border: `1px solid ${stat.color}30`,
                    }}
                  >
                    <Icon size={20} style={{ color: stat.color }} />
                  </div>

                  {/* Counter */}
                  <div
                    className="text-4xl lg:text-5xl font-display font-bold mb-2 transition-all duration-300"
                    style={{ color: stat.color, textShadow: `0 0 20px ${stat.color}40` }}
                  >
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </div>

                  {/* Label */}
                  <p className="text-gray-400 text-sm font-medium leading-tight">{stat.label}</p>

                  {/* Bottom glow */}
                  <div
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-px"
                    style={{ background: `${stat.color}60` }}
                  />
                </div>
              </ScrollReveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
