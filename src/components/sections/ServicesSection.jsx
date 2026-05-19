import { motion } from 'framer-motion'
import { PenLine, Shield, Megaphone, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import { Link } from 'react-router-dom'

const services = [
  {
    icon: PenLine,
    title: 'Content Creation',
    description:
      'Crafting viral crypto threads, articles, educational content, and engaging social posts that drive awareness and conversions for Web3 projects.',
    tags: ['Threads', 'Articles', 'Twitter', 'Copywriting'],
    features: ['Twitter/X threads & campaigns', 'Educational content & tutorials', 'Newsletter & blog writing'],
    color: '#00d4ff',
    borderGlow: 'rgba(0,212,255,0.3)',
    gradient: 'radial-gradient(ellipse at top left, rgba(0,212,255,0.08) 0%, transparent 70%)',
  },
  {
    icon: Shield,
    title: 'Community Moderation',
    description:
      'Managing Telegram, Discord, and social channels 24/7 — keeping communities safe, engaged, and growing with best-in-class moderation strategies.',
    tags: ['Discord', 'Telegram', 'Moderation', '24/7'],
    features: ['24/7 channel monitoring', 'Anti-spam & conflict resolution', 'Engagement event management'],
    color: '#7c3aed',
    borderGlow: 'rgba(124,58,237,0.3)',
    gradient: 'radial-gradient(ellipse at top left, rgba(124,58,237,0.08) 0%, transparent 70%)',
  },
  {
    icon: Megaphone,
    title: 'Ambassador Campaigns',
    description:
      "Leading ambassador programs that expand your project's reach across multiple communities, regions, and crypto ecosystems through authentic advocacy.",
    tags: ['Ambassadors', 'Campaigns', 'Outreach', 'Global'],
    features: ['Global ambassador network setup', 'KPI tracking & management', 'Regional community expansion'],
    color: '#f472b6',
    borderGlow: 'rgba(244,114,182,0.3)',
    gradient: 'radial-gradient(ellipse at top left, rgba(244,114,182,0.08) 0%, transparent 70%)',
  },
  {
    icon: TrendingUp,
    title: 'Growth Strategy',
    description:
      'Data-driven growth strategies combining community-building, content marketing, influencer partnerships, and ecosystem development for sustainable token growth.',
    tags: ['Strategy', 'DeFi', 'NFT', 'Ecosystem'],
    features: ['Full funnel growth planning', 'Influencer & KOL outreach', 'Token launch support'],
    color: '#34d399',
    borderGlow: 'rgba(52,211,153,0.3)',
    gradient: 'radial-gradient(ellipse at top left, rgba(52,211,153,0.08) 0%, transparent 70%)',
  },
]

export default function ServicesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.03) 0%, transparent 70%)' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#c4b5fd' }}
          >
            What I Offer
          </span>
          <h2 className="section-heading neon-text mb-4">Services</h2>
          <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
            Comprehensive Web3 growth services tailored for crypto projects at every stage
          </p>
        </ScrollReveal>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <div
                  className="group relative p-7 rounded-2xl h-full overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(12px)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = service.borderGlow
                    e.currentTarget.style.boxShadow = `0 0 40px ${service.color}10, 0 12px 40px rgba(0,0,0,0.4)`
                    e.currentTarget.style.transform = 'translateY(-6px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.transform = ''
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none rounded-2xl"
                    style={{ background: service.gradient }}
                  />

                  {/* Top accent line */}
                  <div
                    className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100"
                    style={{ background: `linear-gradient(90deg, transparent, ${service.color}80, transparent)` }}
                  />

                  <div className="relative flex flex-col h-full">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 flex-shrink-0"
                      style={{
                        background: `${service.color}10`,
                        border: `1px solid ${service.color}25`,
                      }}
                    >
                      <Icon size={24} style={{ color: service.color }} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3">{service.title}</h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">{service.description}</p>

                    {/* Feature list */}
                    <ul className="space-y-2 mb-5">
                      {service.features.map(feat => (
                        <li key={feat} className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle2 size={13} style={{ color: service.color, flexShrink: 0 }} />
                          {feat}
                        </li>
                      ))}
                    </ul>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5 mt-auto">
                      {service.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{
                            background: `${service.color}0d`,
                            border: `1px solid ${service.color}20`,
                            color: service.color,
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <Link
                      to="/contact"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold group/link w-fit"
                      style={{ color: service.color }}
                    >
                      Get Started
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-200 group-hover/link:translate-x-1"
                      />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* Bottom CTA */}
        <ScrollReveal className="text-center mt-14">
          <p className="text-gray-500 text-sm mb-4">Need a custom package? Let's build it together.</p>
          <Link to="/contact" className="btn-primary text-white inline-flex">
            Start a Conversation <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
