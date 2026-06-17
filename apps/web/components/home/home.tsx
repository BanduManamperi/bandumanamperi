import React from 'react'
import HeroSection from './heroSection'
import ContactSection from './contactSection'
import IntroAnimation from './introAnimation'
import { UpcomingEventsSection } from './upcomingEventsSection'
import { WorkSection } from './workSection'
import { CVSection } from '@/components/about/CVSection'
import { VerticalScrollPanel } from '@/components/vertical-scroll-panel'
import { getUpcomingExhibitions, getExhibitions } from '@/lib/actions/exhibitions'

const Home = async () => {
    // Prefer ongoing/upcoming events; fall back to recent past events so the
    // section always has something to show.
    let events = await getUpcomingExhibitions()
    if (events.length === 0) {
        events = (await getExhibitions()).slice(0, 6)
    }

    const panel = "w-screen flex-shrink-0 h-full overflow-hidden"

    return (
        <>
            <IntroAnimation />

            <div className="flex flex-row h-full w-max flex-shrink-0">

                <div id="panel-hero" data-panel data-panel-label="About" className={panel}>
                    <HeroSection />
                </div>

                <div id="panel-work" data-panel data-panel-label="Work" className={panel}>
                    <WorkSection />
                </div>

                {events.length > 0 && (
                    <div id="panel-upcoming" data-panel data-panel-label="Events" className={panel}>
                        <UpcomingEventsSection exhibitions={events} />
                    </div>
                )}

                <VerticalScrollPanel id="panel-background" label="Background">
                    <div className="min-h-full bg-background">
                        <main className="pt-16 md:pt-24 pb-24">
                            <div className="max-w-7xl mx-auto px-6 lg:px-12">
                                <div className="text-center mb-16">
                                    <p className="text-sm tracking-widest uppercase text-muted-foreground mb-4">
                                        A Little About Me
                                    </p>
                                    <h2 className="text-4xl md:text-5xl font-serif mb-4">
                                        Background in Art
                                    </h2>
                                </div>
                                <CVSection />
                            </div>
                        </main>
                    </div>
                </VerticalScrollPanel>

                <div id="panel-contact" data-panel data-panel-label="Contact" className={panel}>
                    <ContactSection />
                </div>

            </div>
        </>
    )
}

export default Home
