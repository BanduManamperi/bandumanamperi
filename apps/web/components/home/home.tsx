import React from 'react'
import HeroSection from './heroSection'
import FeaturedWorks from './featuredWorks'
import { getFeaturedArtworks } from '@/lib/data/artworks'
import AboutSection from './aboutSection'
import ContactSection from './contactSection'
import IntroAnimation from './introAnimation'
import { ExhibitionBanner } from './exhibitionBanner'
import { getHighlightedExhibitions } from '@/lib/actions/exhibitions'

const Home = async () => {
    // Fetch featured artworks
    // This can be easily replaced with a database query later
    const [featuredArtworks, highlightedExhibitions] = await Promise.all([
        getFeaturedArtworks(),
        getHighlightedExhibitions(),
    ])

    return (
        <div>
            <IntroAnimation />
            <ExhibitionBanner exhibitions={highlightedExhibitions} />
            <HeroSection />
            <FeaturedWorks artworks={featuredArtworks} />
            <AboutSection />
            <ContactSection />

        </div>
    )
}

export default Home