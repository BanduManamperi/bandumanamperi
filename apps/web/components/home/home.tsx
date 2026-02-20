import React from 'react'
import HeroSection from './heroSection'
import FeaturedWorks from './featuredWorks'
import { getFeaturedArtworks } from '@/lib/data/artworks'
import AboutSection from './aboutSection'
import ContactSection from './contactSection'
import IntroAnimation from './introAnimation'

const Home = async () => {
    // Fetch featured artworks
    // This can be easily replaced with a database query later
    const featuredArtworks = await getFeaturedArtworks()

    return (
        <div>
            <IntroAnimation />
            <HeroSection />
            <FeaturedWorks artworks={featuredArtworks} />
            <AboutSection />
            <ContactSection />

        </div>
    )
}

export default Home