import React from 'react'
import HeroSection from './heroSection'
import FeaturedWorks from './featuredWorks'
import { getFeaturedArtworks } from '@/lib/data/artworks'
import AboutSection from './aboutSection'
import ContactSection from './contactSection'
import IntroAnimation from './introAnimation'
import { UpcomingEventsSection } from './upcomingEventsSection'
import { getUpcomingExhibitions } from '@/lib/actions/exhibitions'

const Home = async () => {
    const [featuredArtworks, upcomingExhibitions] = await Promise.all([
        getFeaturedArtworks(),
        getUpcomingExhibitions(),
    ])

    return (
        <div>
            <IntroAnimation />
            <HeroSection />
            <UpcomingEventsSection exhibitions={upcomingExhibitions} />
            <FeaturedWorks artworks={featuredArtworks} />
            <AboutSection />
            <ContactSection />

        </div>
    )
}

export default Home