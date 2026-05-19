import { motion } from 'framer-motion'
import { PenLine, Shield, Megaphone, TrendingUp, ArrowRight } from 'lucide-react'
import ScrollReveal from '../ui/ScrollReveal'
import { Link } from 'react-router-dom'

const services = [
  {
    icon: PenLine,
    title: 'Content Creation',
    description:
      'Crafting viral crypto threads, articles, educational content, and engaging social media posts that drive awareness and conversions for Web3 projects.',
    tags: ['Threads', 'Articles', 'Twitter', 'Copywriting'],
    color: '#00d4ff',
    gradient: 'linear-gradient(135deg, rgba(0,212,255,0.1) 0%, transparent 100%)',
    borderGlow: 'rgba(0,212,255,0.3)',
  },
  {
    icon: Shield,
    title: 'Community Moderation',
    description:
      'Managing Telegram, Discord, and social channels 24/7 — keeping communities safe, engaged, and growing with best-in-class mod strategies.',
    tags: ['Discord', 'Telegram', 'Moderation', '24/7'],
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg, rgba(124,58,237,0.1) 0%, transparent 100%)',
    borderGlow: 'rgba(124,58,237,0.3)',
  },
  {
    icon: Megaphone,
    title: 'Ambassador Campaigns',
    description:
      'Leading ambassador programs that expand your project\'s reach across multiple communities, regions, and crypto ecosystems through authentic advocacy.',
    tags: ['Ambassadors', 'Campaigns', 'Outreach', 'Growth'],
    color: '#f472b6',
    gradient: 'linear-gradient(135deg, rgba(244,114,182,0.1) 0%, transparent 100%)',
    borderGlow: 'rgba(244,114,182,0.3)',
  },
  {
    icon: TrendingUp,
    title: 'Growth Strategy',
    description:
      'Data-driven growth strategies combining community-building, content marketing, influencer partnerships, and ecosystem development for sustainable token growth.',
    tags: ['Strategy', 'DeFi', 'NFT', 'Ecosystem'],
    color: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.1) 0%, transparent 100%)',
    borderGlow: 'rgba(52,211,153,0.3)',
  },
]

export default function ServicesSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, rgba(124,58,237,0.04) 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)', color: '#a78bfa' }}
          >
            What I Offer
          </div>
          <h2 className="section-heading neon-text mb-4">Services</h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Comprehensive Web3 growth services tailored for crypto projects at any stage
          </p>
        </ScrollReveal>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, i) => {
            const Icon = service.icon
            return (
              <ScrollReveal key={service.title} delay={i * 0.1}>
                <div
                  className="group relative p-6 lg:p-8 rounded-2xl transition-all duration-300 overflow-hidden cursor-default h-full"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = service.borderGlow
                    e.currentTarget.style.boxShadow = `0 0 30px ${service.color}15, 0 8px 32px rgba(0,0,0,0.4)`
                    e.currentTarget.style.transform = 'translateY(-6px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.boxShadow = ''
                    e.currentTarget.style.transform = ''
                  }}
                >
                  {/* Gradient bg */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{ background: service.gradient }}
                  />

                  {/* Top glow line */}
                  <div
                    className="absolute top-0 left-8 right-8 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: `linear-gradient(90deg, transparent, ${service.color}60, transparent)` }}
                  />

                  <div className="relative">
                    {/* Icon */}
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110"
                      style={{
                        background: `${service.color}12`,
                        border: `1px solid ${service.color}25`,
                        boxShadow: `0 0 20px ${service.color}10`,
                      }}
                    >
                      <Icon size={24} style={{ color: service.color }} />
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-50 transition-colors">
                      {service.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">
                      {service.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {service.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 rounded-md text-xs font-medium"
                          style={{
                            background: `${service.color}10`,
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
                      className="inline-flex items-center gap-1.5 text-sm font-medium transition-all duration-200 group/link"
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
      </div>
    </section>
  )
}
