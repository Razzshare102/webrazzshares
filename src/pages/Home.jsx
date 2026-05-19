import usePageMeta from '../hooks/usePageMeta'
import HeroSection from '../components/sections/HeroSection'
import StatsSection from '../components/sections/StatsSection'
import ServicesSection from '../components/sections/ServicesSection'
import TestimonialsSection from '../components/sections/TestimonialsSection'

export default function Home() {
  usePageMeta({
    title: 'RazzShares | Web3 Content Creator & Community Moderator',
    description: 'Helping crypto projects grow through content, engagement, and ecosystem building.',
  })
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <TestimonialsSection />
    </main>
  )
}
