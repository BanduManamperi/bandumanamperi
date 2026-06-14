import React from 'react'
import HeroSection from './heroSection'
import FeaturedWorks from './featuredWorks'
import { getFeaturedArtworks } from '@/lib/data/artworks'
import AboutSection from './aboutSection'
import ContactSection from './contactSection'
import IntroAnimation from './introAnimation'
import { ExhibitionBanner } from './exhibitionBanner'
import { UpcomingEventsSection } from './upcomingEventsSection'
import { getHighlightedExhibitions, getUpcomingExhibitions } from '@/lib/actions/exhibitions'

const Home = async () => {
    // Fetch featured artworks
    // This can be easily replaced with a database query later
    const [featuredArtworks, highlightedExhibitions, upcomingExhibitions] = await Promise.all([
        getFeaturedArtworks(),
        getHighlightedExhibitions(),
        getUpcomingExhibitions(),
    ])

    return (
        <div>
            <IntroAnimation />
            <ExhibitionBanner exhibitions={highlightedExhibitions} />
            <HeroSection />
            <UpcomingEventsSection exhibitions={upcomingExhibitions} />
            <FeaturedWorks artworks={featuredArtworks} />
            <AboutSection />
            <ContactSection />

        </div>
    )
}

export default Home