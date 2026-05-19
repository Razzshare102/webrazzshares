import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ExternalLink, Twitter, Send, MessageCircle, Plus, Tag, Search, Filter } from 'lucide-react'
import ScrollReveal from '../components/ui/ScrollReveal'
import { usePortfolio } from '../hooks/useSupabase'
import usePageMeta from '../hooks/usePageMeta'
import { Link } from 'react-router-dom'

const DEMO_PROJECTS = [
  {
    id: 1,
    title: 'DeFi Protocol Alpha',
    description: 'Led community management and content strategy for a leading DeFi protocol. Grew Telegram from 2K to 18K members in 3 months.',
    tags: ['DeFi', 'Community', 'Telegram', 'Content'],
    visit_url: '#',
    twitter_url: 'https://twitter.com',
    featured: true,
  },
  {
    id: 2,
    title: 'NFT Launchpad Beta',
    description: 'Created viral Twitter threads and managed ambassador program. Generated 500K+ impressions across launch campaigns.',
    tags: ['NFT', 'Ambassador', 'Twitter', 'Marketing'],
    visit_url: '#',
    telegram_url: 'https://t.me',
    featured: true,
  },
  {
    id: 3,
    title: 'Layer2 Scaling Solution',
    description: 'Content creation and ecosystem building. Educational threads, tutorials, and community events onboarded 5000+ new users.',
    tags: ['Layer2', 'Education', 'Growth', 'Discord'],
    visit_url: '#',
    discord_url: '#',
    featured: false,
  },
  {
    id: 4,
    title: 'GameFi Metaverse Project',
    description: 'Full ambassador campaign management across 10+ regions. Built a network of 200+ ambassadors creating quality content.',
    tags: ['GameFi', 'Metaverse', 'Ambassadors', 'Global'],
    visit_url: '#',
    twitter_url: 'https://twitter.com',
    featured: false,
  },
  {
    id: 5,
    title: 'Yield Optimization Protocol',
    description: 'Growth strategy and community moderation. Designed a referral program that doubled TVL within 60 days.',
    tags: ['DeFi', 'Yield', 'Strategy', 'Growth'],
    visit_url: '#',
    telegram_url: 'https://t.me',
    featured: true,
  },
  {
    id: 6,
    title: 'Web3 Social Platform',
    description: 'Drove organic growth through thought-leadership content and community events. Built a Discord of 12K+ engaged members.',
    tags: ['Social', 'Discord', 'Community', 'Content'],
    visit_url: '#',
    discord_url: '#',
    featured: false,
  },
]

const ALL_TAGS = ['All', 'DeFi', 'NFT', 'Layer2', 'GameFi', 'Community', 'Content', 'Ambassador', 'Discord', 'Telegram']

function ProjectCard({ project, index }) {
  return (
    <ScrollReveal delay={index * 0.07}>
      <div
        className="group relative h-full flex flex-col rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(10px)' }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)'
          e.currentTarget.style.boxShadow = '0 0 30px rgba(0,212,255,0.08), 0 8px 32px rgba(0,0,0,0.4)'
          e.currentTarget.style.transform = 'translateY(-6px)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
          e.currentTarget.style.boxShadow = ''
          e.currentTarget.style.transform = ''
        }}
      >
        {project.featured && (
          <div
            className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-xs font-semibold z-10"
            style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}
          >
            Featured
          </div>
        )}

        {/* Logo area */}
        <div
          className="w-full h-44 flex items-center justify-center relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #070f1f, #0c1930)' }}
        >
          {project.logo_url ? (
            <img src={project.logo_url} alt={project.title} className="w-24 h-24 object-contain" />
          ) : (
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-display font-bold"
              style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.15), rgba(124,58,237,0.15))', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}
            >
              {project.title[0]}
            </div>
          )}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100"
            style={{ background: 'linear-gradient(135deg, transparent 30%, rgba(0,212,255,0.04) 50%, transparent 70%)' }}
          />
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-100">{project.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1 line-clamp-3">{project.description}</p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.tags?.map(tag => (
              <span
                key={tag}
                className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs"
                style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)', color: '#67e8f9' }}
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {project.visit_url && project.visit_url !== '#' && (
              <a
                href={project.visit_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 btn-primary text-white text-xs py-2 justify-center"
              >
                Visit <ExternalLink size={11} />
              </a>
            )}
            <div className="flex gap-1.5">
              {project.twitter_url && (
                <a href={project.twitter_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(29,161,242,0.1)', border: '1px solid rgba(29,161,242,0.2)', color: '#1da1f2' }}>
                  <Twitter size={12} />
                </a>
              )}
              {project.telegram_url && (
                <a href={project.telegram_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(0,136,204,0.1)', border: '1px solid rgba(0,136,204,0.2)', color: '#0088cc' }}>
                  <Send size={12} />
                </a>
              )}
              {project.discord_url && (
                <a href={project.discord_url} target="_blank" rel="noopener noreferrer"
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'rgba(88,101,242,0.1)', border: '1px solid rgba(88,101,242,0.2)', color: '#5865f2' }}>
                  <MessageCircle size={12} />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  )
}

export default function Portfolio() {
  usePageMeta({
    title: 'Portfolio | RazzShares',
    description: 'Explore 50+ Web3 projects and campaigns by RazzShares — DeFi, NFT, Layer2, GameFi and more.',
  })

  const { data: dbProjects, loading } = usePortfolio()
  const projects = dbProjects.length > 0 ? dbProjects : DEMO_PROJECTS

  const [activeTag, setActiveTag] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = projects.filter(p => {
    const matchesTag = activeTag === 'All' || p.tags?.includes(activeTag)
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTag && matchesSearch
  })

  return (
    <div className="min-h-screen pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <ScrollReveal className="text-center mb-12">
          <span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-4"
            style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.18)', color: '#67e8f9' }}
          >
            My Work
          </span>
          <h1 className="section-heading neon-text mb-4">Portfolio</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            A showcase of Web3 projects, campaigns, and communities I've helped grow
          </p>
        </ScrollReveal>

        {/* Filters */}
        <ScrollReveal className="mb-10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative max-w-xs w-full sm:w-auto">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="input-field pl-9 text-sm py-2.5 w-full"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Filter size={13} className="text-gray-600 flex-shrink-0" />
              {ALL_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setActiveTag(tag)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{
                    background: activeTag === tag ? 'linear-gradient(135deg, #00d4ff, #7c3aed)' : 'rgba(255,255,255,0.04)',
                    border: activeTag === tag ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    color: activeTag === tag ? 'white' : '#9ca3af',
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">No projects found</p>
            <p className="text-sm">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filtered.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* CTA */}
        <ScrollReveal className="text-center mt-16">
          <div
            className="inline-block p-8 rounded-3xl"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <h3 className="text-2xl font-bold text-white mb-3">Have a project in mind?</h3>
            <p className="text-gray-500 mb-6">Let's build something amazing together in Web3</p>
            <Link to="/contact" className="btn-primary text-white inline-flex">
              Start a Conversation <Plus size={16} />
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </div>
  )
}
