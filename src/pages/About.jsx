import { motion } from 'framer-motion'
import { CheckCircle2, Briefcase, Users, PenLine, Globe, Award, ArrowRight, Download } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import { Link } from 'react-router-dom'
import usePageMeta from '../hooks/usePageMeta'

const timelineEvents = [
  { year: '2020', title: 'Entered the Crypto Space', description: 'Began exploring blockchain technology, DeFi protocols, and early NFT projects. Built foundational knowledge in crypto ecosystems.', icon: Globe, color: '#00d4ff' },
  { year: '2021', title: 'First Community Role', description: 'Joined first project as a community moderator. Rapidly grew Discord and Telegram communities by implementing engagement strategies.', icon: Users, color: '#7c3aed' },
  { year: '2022', title: 'Content Creation & Threads', description: 'Started creating viral crypto content on Twitter. Educational threads on DeFi, NFTs, and Web3 concepts gained massive traction.', icon: PenLine, color: '#f472b6' },
  { year: '2023', title: 'Ambassador Program Leadership', description: 'Led global ambassador programs for multiple top-tier blockchain projects. Built networks of 200+ ambassadors across 10+ regions.', icon: Award, color: '#34d399' },
  { year: '2024', title: 'Full-Scale Web3 Agency Work', description: 'Expanded to full-scale Web3 growth consultancy — working with DeFi, L2s, GameFi, and social platforms simultaneously.', icon: Briefcase, color: '#fb923c' },
  { year: '2025', title: 'RazzShares Brand Launch', description: 'Officially launched RazzShares as a premium Web3 creator brand, serving 50+ projects with content, community, and growth strategies.', icon: Globe, color: '#00d4ff' },
]

const skills = [
  'Twitter/X Content Creation', 'Telegram Community Management', 'Discord Server Management',
  'Ambassador Program Design', 'DeFi Protocol Analysis', 'NFT Project Marketing',
  'Token Launch Campaigns', 'Crypto Thread Writing', 'Growth Strategy',
  'Community Engagement', 'Influencer Outreach', 'Web3 Ecosystem Building',
]

const highlights = [
  { label: 'Projects Completed', value: '50+', desc: 'Across DeFi, NFT, L2, GameFi ecosystems', color: '#00d4ff' },
  { label: 'Total Campaign Reach', value: '500K+', desc: 'Impressions across all campaigns', color: '#7c3aed' },
  { label: 'Communities Managed', value: '30+', desc: 'Discord & Telegram servers', color: '#f472b6' },
  { label: 'Content Pieces', value: '1000+', desc: 'Threads, articles, and posts', color: '#34d399' },
]

export default function About() {
  usePageMeta({
    title: 'About | RazzShares',
    description: 'Learn about RazzShares — Web3 content creator and community builder with 5+ years in the crypto space.',
  })
  return (
    <div className="min-h-screen pt-28 pb-20">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 70% 20%, rgba(124,58,237,0.04) 0%, transparent 50%)' }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <ScrollReveal className="text-center mb-16">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)', color: '#c4b5fd' }}
          >
            About Me
          </span>
          <h1 className="section-heading neon-text mb-4">The Story Behind RazzShares</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            A passionate Web3 builder helping crypto projects find their voice, grow their communities, and achieve sustainable ecosystem growth.
          </p>
        </ScrollReveal>

        {/* Bio + stats grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-24">
          {/* Profile card */}
          <ScrollReveal direction="right">
            <div
              className="relative p-8 rounded-3xl h-full"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}
            >
              <div className="absolute top-0 left-8 right-8 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.4), transparent)' }} />

              {/* Avatar */}
              <div className="flex items-center gap-5 mb-6">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-black flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #00d4ff, #7c3aed)', boxShadow: '0 0 30px rgba(0,212,255,0.3)' }}
                >
                  R
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white font-display">RazzShares</h2>
                  <p className="text-cyan-400 text-sm">Web3 Content Creator & Community Builder</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-green-400 text-xs">Available for projects</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 text-gray-400 text-sm leading-relaxed mb-6">
                <p>
                  I'm a passionate Web3 native with <span className="text-cyan-400 font-medium">5+ years of experience</span> in the crypto space. My journey started in 2020 when I became fascinated by the potential of decentralized technologies to reshape how communities interact.
                </p>
                <p>
                  Since then, I've worked with <span className="text-purple-400 font-medium">50+ blockchain projects</span> across DeFi, NFT, Layer2, GameFi, and social Web3 ecosystems — helping them build engaged communities, create compelling content, and execute effective growth strategies.
                </p>
                <p>
                  My approach is always <span className="text-pink-400 font-medium">authentic and data-driven</span>. I believe in building real communities of engaged users, not just inflating metrics.
                </p>
              </div>

              {/* Skills */}
              <h4 className="text-white text-sm font-semibold mb-3">Core Skills</h4>
              <div className="flex flex-wrap gap-2 mb-6">
                {skills.map(skill => (
                  <span
                    key={skill}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ background: 'rgba(0,212,255,0.06)', border: '1px solid rgba(0,212,255,0.12)', color: '#67e8f9' }}
                  >
                    <CheckCircle2 size={10} className="text-cyan-500" />
                    {skill}
                  </span>
                ))}
              </div>

              <Link to="/contact" className="btn-primary text-white text-sm inline-flex">
                Work With Me <ArrowRight size={14} />
              </Link>
            </div>
          </ScrollReveal>

          {/* Highlights */}
          <ScrollReveal direction="left" className="flex flex-col gap-4">
            {highlights.map((item, i) => (
              <ScrollReveal key={item.label} delay={i * 0.1}>
                <div
                  className="flex items-center gap-5 p-5 rounded-2xl"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = item.color + '40'
                    e.currentTarget.style.background = item.color + '06'
                    e.currentTarget.style.transform = 'translateX(4px)'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.02)'
                    e.currentTarget.style.transform = ''
                  }}
                >
                  <div
                    className="text-4xl font-display font-bold flex-shrink-0"
                    style={{ color: item.color, textShadow: `0 0 20px ${item.color}40`, minWidth: '90px' }}
                  >
                    {item.value}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{item.label}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </ScrollReveal>
        </div>

        {/* Timeline */}
        <ScrollReveal className="text-center mb-12">
          <h2 className="text-2xl font-display font-bold text-white mb-2">My Web3 Journey</h2>
          <p className="text-gray-500 text-sm">The milestones that shaped my path in the crypto space</p>
        </ScrollReveal>

        <div className="relative max-w-3xl mx-auto mb-20">
          {/* Line */}
          <div
            className="absolute left-8 lg:left-1/2 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(180deg, transparent, rgba(0,212,255,0.3) 10%, rgba(124,58,237,0.3) 90%, transparent)', transform: 'translateX(-50%)' }}
          />

          {timelineEvents.map((event, i) => {
            const Icon = event.icon
            const isLeft = i % 2 === 0
            return (
              <ScrollReveal key={event.year} delay={i * 0.08} className="relative mb-8">
                <div className={`flex items-start gap-4 lg:gap-0 ${isLeft ? 'lg:flex-row' : 'lg:flex-row-reverse'} pl-20 lg:pl-0`}>
                  {/* Icon bubble */}
                  <div className="absolute left-4 lg:left-1/2 top-0 -translate-x-1/2 z-10">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: `${event.color}18`, border: `2px solid ${event.color}50`, boxShadow: `0 0 15px ${event.color}25` }}
                    >
                      <Icon size={16} style={{ color: event.color }} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className={`flex-1 lg:w-5/12 ${isLeft ? 'lg:mr-auto lg:pr-12' : 'lg:ml-auto lg:pl-12'}`}>
                    <div
                      className="p-5 rounded-2xl"
                      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
                      onMouseEnter={e => {
                        e.currentTarget.style.borderColor = event.color + '40'
                        e.currentTarget.style.boxShadow = `0 0 20px ${event.color}08`
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                        e.currentTarget.style.boxShadow = ''
                      }}
                    >
                      <span className="text-xs font-mono font-bold mb-1 block" style={{ color: event.color }}>{event.year}</span>
                      <h3 className="text-white font-bold mb-1.5">{event.title}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{event.description}</p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )
          })}
        </div>

        {/* CTA */}
        <ScrollReveal className="text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to grow your Web3 project?</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">Let's combine my experience with your vision to build something extraordinary.</p>
          <Link to="/contact" className="btn-primary text-white inline-flex">
            Let's Work Together <ArrowRight size={16} />
          </Link>
        </ScrollReveal>
      </div>
    </div>
  )
}
